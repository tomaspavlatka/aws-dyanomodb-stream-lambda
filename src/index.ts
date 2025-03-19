import type { DynamoDBStreamEvent } from 'aws-lambda'
import { BillableHandler } from './billable.handler'
import { CompanyFacade } from './company.facade';
import { PersistanceFacade } from './persistance.facade';
import { EasybillFacade } from './easybill.facade';

export const handler = async (event: DynamoDBStreamEvent) => {
  // Manually adding profiles relations before we are able to
  // pull this data from the company service API
  const profiles: CompanyProfile[] = [];
  profiles.push({
    id: 'customer_01',
    easybill_customer_id: '2322507260'
  });
  const companyFacade = new CompanyFacade(profiles);

  const persistanceFacade = new PersistanceFacade();
  const easybillFacade = new EasybillFacade();
  const handler = new BillableHandler(
    companyFacade, easybillFacade, persistanceFacade
  );

  for (const record of event.Records) {
    await handler.handle(record)
  }
}
