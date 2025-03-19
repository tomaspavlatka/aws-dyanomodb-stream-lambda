import { CompanyProfile } from './contracts';
import { Either } from './either';
import { CompanyNotFoundException } from './exceptions/company-not-found.exception';
import { ContextAwareException } from './exceptions/context-aware.exception';

export class CompanyFacade {
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
