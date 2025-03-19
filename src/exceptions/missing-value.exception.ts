import { ContextAwareException } from './context-aware.exception';
import { ErrorCode } from './error-code.enum';
import { HttpStatusCode } from './http-status-code.enum';

export class MissingValueException extends ContextAwareException {
  static create(field: string, data: string) {
    const context = { field, data };
    return new MissingValueException(
      `Mandatory value for the field ${field} is missing`,
      ErrorCode.MissingValue,
      HttpStatusCode.InternalError,
      context,
    );
  }
}
