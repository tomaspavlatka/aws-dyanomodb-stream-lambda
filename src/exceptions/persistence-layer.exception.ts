import { ContextAwareException } from './context-aware.exception';
import { ErrorCode } from './error-code.enum';
import { HttpStatusCode } from './http-status-code.enum';

export class PersistenceLayerException extends ContextAwareException {
  static create(error: string) {
    return new PersistenceLayerException(
      'An issue happend while working with persistence layer',
      ErrorCode.PersistenceLayerError,
      HttpStatusCode.InternalError,
      { error }
    );
  }
}
