import { ContextAwareException } from './context-aware.exception';
import { ErrorCode } from './error-code.enum';
import { HttpStatusCode } from './http-status-code.enum';

export class CompanyNotFoundException extends ContextAwareException {
  static create(companyId: string) {
    const context = {companyId};
    return new CompanyNotFoundException(
      `Company with ID ${companyId} has not been found`,
      ErrorCode.CompanyNotFound,
      HttpStatusCode.BadRequest,
      context,
    );
  }
}
