import { DynamoDBRecord } from 'aws-lambda';
import { isEligible } from './validator';
import { toBillable as mapperToBillable } from './mapper';
import { CompanyFacade } from './company.facade';
import { EasybillFacade } from './easybill.facade';
import { PersistenceFacade } from './persistence.facade';
import { ErrorCode } from './exceptions/error-code.enum';

type Context = {
  record: DynamoDBRecord;
  billable?: Billable;
  companyProfile?: CompanyProfile;
  invoice?: Invoice;
};

export class BillableHandler {
  constructor(
    private companyFacade: CompanyFacade,
    private easybillFacade: EasybillFacade,
    private persistenceFacade: PersistenceFacade,
  ) {}

  async handle(record: DynamoDBRecord) {
    const data = await (
      await (
        await this.validateEligibility({ record })
          .bind((ctx) => this.toBillable(ctx))
          .bindAsync((ctx) => this.retrieveCompanyProfile(ctx))
      ).bindAsync((ctx) => this.createInvoice(ctx))
    ).bindAsync((ctx) => this.saveEasybillId(ctx));

    // We need to handle the bad scenarios
    if (data.isLeft()) {
      const error = data.getLeft();
      // We have a special case here, where we return left from eligibility
      // checking. We do not consider this as error, but more architectural decision
      // and therefore we will only log an info for the future generation
      // of hopefully not only AI-programmers
      if (error.errorCode === ErrorCode.CanSkip) {
        console.log('skipping');
        return;
      }

      console.error('error', JSON.stringify(data.getLeft()));
    }

    console.log('processed');
  }

  private async saveEasybillId(ctx: Context) {
    // TODO: Figure out what we get back from the dynamodb update
    return (
      await this.persistenceFacade.markAsCreated(ctx.billable!, ctx.invoice!)
    ).mapRight(() => ctx);
  }

  private async createInvoice(ctx: Context) {
    return (
      await this.easybillFacade.createInvoice(
        ctx.companyProfile!,
        ctx.billable!,
      )
    ).mapRight((invoice) => ({ ...ctx, invoice }));
  }

  private async retrieveCompanyProfile(ctx: Context) {
    return (
      await this.companyFacade.getProfile(ctx.billable!.companyId)
    ).mapRight((companyProfile) => ({ ...ctx, companyProfile }));
  }

  private toBillable(ctx: Context) {
    return mapperToBillable(ctx.record).mapRight((billable) => ({
      ...ctx,
      billable,
    }));
  }

  private validateEligibility(ctx: Context) {
    return isEligible(ctx.record).mapRight(() => ctx);
  }
}
