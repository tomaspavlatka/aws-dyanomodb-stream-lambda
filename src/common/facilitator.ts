import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { AxiosHeaders } from 'axios';

import { BillableHandler } from '../billable.handler';
import { ContextAwareException } from '../exceptions/context-aware.exception';
import { CompanyFacade } from '../facades/company.facade';
import { EasybillFacade } from '../facades/easybill.facade';
import { PersistenceFacade } from '../facades/persistence.facade';
import { ApiClient } from '../infra/api.client';
import { Config } from '../infra/config';
import { CompanyProfile } from './contracts';
import { Either } from './either';

type EasybillConfig = {
  authToken: string;
  baseUrl: string;
};

type PersistenceConfig = {
  region: string;
  tableName: string;
};

export class Facilitator {
  private getEasybillFacade(): Either<ContextAwareException, EasybillFacade> {
    return this.getEasybillConfig()
      .bind((config) => {
        return Either.right(
          new ApiClient(config.baseUrl, new AxiosHeaders(), config.authToken),
        );
      })
      .bind((apiClient) => Either.right(new EasybillFacade(apiClient)));
  }

  private getEasybillConfig(): Either<ContextAwareException, EasybillConfig> {
    return Config.get('EASYBILL_BASE_URL').bind((baseUrl) =>
      Config.get('EASYBILL_AUTH_TOKEN').mapRight((authToken) => ({
        authToken,
        baseUrl,
      })),
    );
  }

  private getCompanyFacade(): Either<ContextAwareException, CompanyFacade> {
    // Manually adding profiles relations before we are able to
    // pull this data from the company service API
    const profiles: CompanyProfile[] = [];
    profiles.push({
      id: 'customer_01',
      easybillCustomerId: '2322507260',
    });

    return Either.right(new CompanyFacade(profiles));
  }

  private getPersistenceFacade(): Either<
    ContextAwareException,
    PersistenceFacade
  > {
    return this.getPersistenceConfig().mapRight((config) => {
      const dbClient = new DynamoDBClient({ region: config.region });

      return new PersistenceFacade(dbClient, config.tableName);
    });
  }

  private getPersistenceConfig(): Either<
    ContextAwareException,
    PersistenceConfig
  > {
    return Config.get('PERSISTENCE_REGION').bind((region) =>
      Config.get('PERSISTENCE_TABLE_NAME').mapRight((tableName) => ({
        region,
        tableName,
      })),
    );
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

    const persistenceFacade = this.getPersistenceFacade();
    if (persistenceFacade.isLeft()) {
      return Either.left(persistenceFacade.getLeft());
    }

    return Either.right(
      new BillableHandler(
        companyFacade.getRight(),
        easybillFacade.getRight(),
        persistenceFacade.getRight(),
      ),
    );
  }
}
