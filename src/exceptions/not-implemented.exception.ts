import { ContextAwareException } from './context-aware.exception';
import { ErrorCode } from './error-code.enum';
import { HttpStatusCode } from './http-status-code.enum';

export class NotImplementedException extends ContextAwareException {
  static create(name: string) {
    return new NotImplementedException(
      `The functionality has not been implemented yet`,
      ErrorCode.NotImplemented,
      HttpStatusCode.InternalError,
      { name },
    );
  }
}
