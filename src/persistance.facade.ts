import { Either } from "./either";
import { ContextAwareException } from "./exceptions/context-aware.exception";
import { NotImplementedException } from "./exceptions/not-implemented.exception";

export class PersistanceFacade {
  async markAsCreated(billable: Billable, invoice: Invoice): Promise<Either<ContextAwareException, null>> {
    return Either.left(NotImplementedException.create('persistance:markAsCreated'));
  }
}
