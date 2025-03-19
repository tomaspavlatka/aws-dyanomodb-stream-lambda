import { DynamoDBRecord } from 'aws-lambda';

import { Billable, CompanyProfile, Invoice } from './common/contracts';
import { Either } from './common/either';
import { ContextAwareException } from './exceptions/context-aware.exception';
import { CompanyFacade } from './facades/company.facade';
import { EasybillFacade } from './facades/easybill.facade';
import { PersistenceFacade } from './facades/persistence.facade';
import { toBillable as mapperToBillable } from './mapper';
import { isEligible } from './validator';

type Context = {
  billable?: Billable;
  companyProfile?: CompanyProfile;
  invoice?: Invoice;
  record: DynamoDBRecord;
};

export class BillableHandler {
  constructor(
    private companyFacade: CompanyFacade,
    private easybillFacade: EasybillFacade,
    private persistenceFacade: PersistenceFacade,
  ) {}

  async handle(
    record: DynamoDBRecord,
  ): Promise<Either<ContextAwareException, null>> {
    return (
      await (
        await (
          await this.validateEligibility({ record })
            .bind((ctx) => this.toBillable(ctx))
            .bindAsync((ctx) => this.retrieveCompanyProfile(ctx))
        ).bindAsync((ctx) => this.createInvoice(ctx))
      ).bindAsync((ctx) => this.saveEasybillId(ctx))
    ).mapRight(() => null);
  }

  private async saveEasybillId(ctx: Context) {
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
