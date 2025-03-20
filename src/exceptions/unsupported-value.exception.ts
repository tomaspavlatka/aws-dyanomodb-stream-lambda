import { ContextAwareException } from './context-aware.exception';
import { ErrorCode } from './error-code.enum';
import { HttpStatusCode } from './http-status-code.enum';

export class UnsupportedValueException extends ContextAwareException {
  static create(value: string, info: string) {
    const context = { value, info };
    return new UnsupportedValueException(
      `Value ${value} is not supported`,
      ErrorCode.UnsupportedValue,
      HttpStatusCode.InternalError,
      context,
    );
  }
}
