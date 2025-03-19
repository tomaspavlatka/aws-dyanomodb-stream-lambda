import { Billable, CompanyProfile, Invoice } from '../common/contracts';
import { Either } from '../common/either';
import { ContextAwareException } from '../exceptions/context-aware.exception';
import { ApiClient } from '../infra/api.client';

type InvoiceDraft = Omit<Invoice, 'id'>;

// TODO: See what VAT we need to apply
const DEFAULT_VAT_PERCENT = 0;

export class EasybillFacade {
  constructor(private readonly apiClient: ApiClient) {}

  async createInvoice(
    company: CompanyProfile,
    billable: Billable,
  ): Promise<Either<ContextAwareException, Invoice>> {
    return this.getDraft(company, billable).bindAsync(async (draft) =>
      this.doCreateInvoice(draft),
    );
  }

  private async doCreateInvoice(
    draft: InvoiceDraft,
  ): Promise<Either<ContextAwareException, Invoice>> {
    // TODO: Handle invalid case
    const invoice = await this.apiClient.request<Invoice>(
      '/documents',
      'POST',
      draft,
    );

    return Either.right(invoice);
  }

  private getDraft(
    company: CompanyProfile,
    billable: Billable,
  ): Either<ContextAwareException, InvoiceDraft> {
    return Either.right({
      customer_id: company.easybillCustomerId,
      type: 'INVOICE',
      items: billable.payable.map((payable) => ({
        description: payable.type,
        quantity: payable.quantity,
        single_price_net: payable.price * 100,
        vat_percent: DEFAULT_VAT_PERCENT,
      })),
    });
  }
}
