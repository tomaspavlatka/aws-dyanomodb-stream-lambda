import { Either } from "./either";
import { ContextAwareException } from "./exceptions/context-aware.exception";
import { NotImplementedException } from "./exceptions/not-implemented.exception";

export class PersistanceFacade {
  async markAsCreated(billable: Billable, invoice: Invoice): Promise<Either<ContextAwareException, null>> {
    console.log('billable', JSON.stringify(billable));
    console.log('invoice', JSON.stringify(invoice));
    return Either.left(NotImplementedException.create('persistance:markAsCreated'));
  }
}
