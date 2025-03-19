import { ErrorCode } from './error-code.enum';
import { HttpStatusCode } from './http-status-code.enum';

export class ContextAwareException extends Error {
  readonly context?: object;
  readonly errorCode: ErrorCode;
  readonly httpStatus: HttpStatusCode;

  constructor(
    message: string,
    errorCode: ErrorCode,
    httpStatus: HttpStatusCode,
    context?: object,
  ) {
    super(message);
    this.errorCode = errorCode;
    this.httpStatus = httpStatus;
    this.context = context;
  }
}
