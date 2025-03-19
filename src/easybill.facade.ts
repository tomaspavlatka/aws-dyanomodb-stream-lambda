import { Either } from "./either";
import { ContextAwareException } from "./exceptions/context-aware.exception";
import { NotImplementedException } from "./exceptions/not-implemented.exception";

export class EasybillFacade {
  async createInvoice(company: CompanyProfile, billable: Billable): Promise<Either<ContextAwareException, Invoice>> {
    console.log('company', JSON.stringify(company));
    console.log('billable', JSON.stringify(billable));

    return Either.left(NotImplementedException.create('easybill:createInvoice'));
  }
}
