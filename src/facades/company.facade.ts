import { CompanyProfile } from '../common/contracts';
import { Either } from '../common/either';
import { CompanyNotFoundException } from '../exceptions/company-not-found.exception';
import { ContextAwareException } from '../exceptions/context-aware.exception';

export class CompanyFacade {
  // To speed up the process, we will hardcode the relations 
  // between company_id and easybill_customer_id here.
  // We will revisit this place once the endpoint within company service is ready
  // and retrieve data from there
  constructor(private profiles: CompanyProfile[]) {}

  async getProfile(
    companyId: string,
  ): Promise<Either<ContextAwareException, CompanyProfile>> {
    const profile = this.profiles.find((profile) => profile.id === companyId);

    return profile !== undefined
      ? Either.right(profile)
      : Either.left(CompanyNotFoundException.create(companyId));
  }
}
