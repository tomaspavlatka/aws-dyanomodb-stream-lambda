import { ContextAwareException } from "./context-aware.exception";
import { ErrorCode } from "./error-code.enum";
import { HttpStatusCode } from "./http-status-code.enum";

export class CanSkipException extends ContextAwareException {
  static create() {
    return new CanSkipException(
      "Event can be skipped",
      ErrorCode.CanSkip,
      HttpStatusCode.Ok,
      {},
    );
  }
}
