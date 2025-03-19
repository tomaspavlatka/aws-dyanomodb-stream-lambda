import { AxiosHeaders } from "axios";
import { ApiClient } from "./api.client";
import { Config } from "./config";
import { EasybillFacade } from "./easybill.facade";
import { Either } from "./either";
import { ContextAwareException } from "./exceptions/context-aware.exception";
import { CompanyFacade } from "./company.facade";
import { PersistanceFacade } from "./persistance.facade";
import { BillableHandler } from "./billable.handler";

type EasybillConfig = {
  baseUrl: string
  authToken: string
}

export class Facilitator {
  private getEasybillFacade(): Either<ContextAwareException, EasybillFacade> {
    return this.getEasybillConfig()
      .bind((config) => {
        return Either.right(new ApiClient(config.baseUrl, new AxiosHeaders(), config.authToken))
      }).bind((apiClient) => Either.right(new EasybillFacade(apiClient)));
  }

  private getEasybillConfig(): Either<ContextAwareException, EasybillConfig> {
    return Config.get('EASYBILL_BASE_URL').bind((baseUrl) =>
      Config.get('EASYBILL_AUTH_TOKEN').mapRight((authToken) => ({ authToken, baseUrl })
      ));
  }

  private getCompanyFacade(): Either<ContextAwareException, CompanyFacade> {
    // Manually adding profiles relations before we are able to
    // pull this data from the company service API
    const profiles: CompanyProfile[] = [];
    profiles.push({
      id: 'customer_01',
      easybill_customer_id: '2322507260'
    });

    return Either.right(new CompanyFacade(profiles));
  }

  private getPersistanceFacade(): Either<ContextAwareException, PersistanceFacade> {
    return Either.right(new PersistanceFacade());
  }

  getBillableHandler(): Either<ContextAwareException, BillableHandler> {
    const companyFacade = this.getCompanyFacade();
    if (companyFacade.isLeft()) {
      return Either.left(companyFacade.getLeft());
    }

    const easybillFacade = this.getEasybillFacade();
    if (easybillFacade.isLeft()) {
      return Either.left(easybillFacade.getLeft());
    }

    const persistanceFacade = this.getPersistanceFacade();
    if (persistanceFacade.isLeft()) {
      return Either.left(persistanceFacade.getLeft());
    }

    return Either.right(
      new BillableHandler(
        companyFacade.getRight(),
        easybillFacade.getRight(),
        persistanceFacade.getRight(),
      )
    );
  }
}
