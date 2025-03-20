import { Billable, CompanyProfile, Invoice, InvoiceDraft } from '../common/contracts';
import { Either } from '../common/either';
import { ContextAwareException } from '../exceptions/context-aware.exception';
import { ApiClient } from '../infra/api.client';
import { Mapper } from '../mapper';

export class EasybillFacade {
  constructor(private readonly apiClient: ApiClient) {}

  async createInvoice(
    company: CompanyProfile,
    billable: Billable,
  ): Promise<Either<ContextAwareException, Invoice>> {
    return Mapper.toInvoiceDraft(company, billable).bindAsync(async (draft) =>
      this.doCreateInvoice(draft),
    );
  }

  private async doCreateInvoice(
    draft: InvoiceDraft,
  ): Promise<Either<ContextAwareException, Invoice>> {
    // TODO: Handle invalid case
    const invoice = await this.apiClient.request<Invoice>(
      '/documents',
      'POST',
      draft,
    );

    return Either.right(invoice);
  }
}
