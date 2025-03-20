import { DynamoDBRecord } from 'aws-lambda';

import { Either } from './common/either';
import { ContextAwareException } from './exceptions/context-aware.exception';
import { MissingValueException } from './exceptions/missing-value.exception';
import { UnsupportedValueException } from './exceptions/unsupported-value.exception';
import { Billable, CompanyProfile, InvoiceDraft, InvoiceItem, Payable } from './common/contracts';

const DEFAULT_VAT_PERCENT = 0;

export class Mapper {
  static toInvoiceDraft(company: CompanyProfile, billable: Billable): Either<ContextAwareException, InvoiceDraft> {
    const items = billable.payable.map((payable) => Mapper.toInvoiceItem(payable));
    
    // If we received at least 1 error, we cannot create an ivoice 
    // but report the error instead
    const error = items.find((itm) => itm.isLeft());
    if (error !== undefined) {
      return Either.left(error.getLeft());
    }

    return Either.right({
      customer_id: company.easybillCustomerId,
      type: 'INVOICE',
      items: items.map((itm) => itm.getRight())
    });
  }

  private static toInvoiceItem(payable: Payable): Either<ContextAwareException, InvoiceItem> {
    return Mapper.toInvoiceItemDescription(payable.type).mapRight((description) => ({
      description: description,
      quantity: payable.quantity,
      single_price_net: payable.price * 100,
      vat_percent: DEFAULT_VAT_PERCENT,
    }));
  }

  private static toInvoiceItemDescription(type: string): Either<ContextAwareException, string> {
    switch (type) {
      case 'approved':
        return Either.right('Lead');
      case 'rejected-approved':
        return Either.right('Reklamiert Lead');
      default:
        return Either.left(UnsupportedValueException.create(type, 'payable:type'));
    }
  }

  static toBillable(
    record: DynamoDBRecord,
  ): Either<ContextAwareException, Billable> {
    const id = record.dynamodb?.NewImage?.id.S;
    if (!id) {
      throw Either.left(
        MissingValueException.create('id', JSON.stringify(record.dynamodb!)),
      );
    }

    const companyId = record.dynamodb?.NewImage?.company_id.S;
    if (!companyId) {
      throw Either.left(
        MissingValueException.create(
          'company_id',
          JSON.stringify(record.dynamodb!),
        ),
      );
    }

    const payload = record.dynamodb?.NewImage?.payload.S;
    if (!payload) {
      throw Either.left(
        MissingValueException.create('payable', JSON.stringify(record.dynamodb!)),
      );
    }

    const payable: Payable[] = JSON.parse(payload);

    return Either.right({ id, companyId, payable, externalId: '' });
  };
}
