import type { DynamoDBStreamEvent } from 'aws-lambda';

import { Facilitator } from './common/facilitator';


export const handler = async (event: DynamoDBStreamEvent) => {
  const facilitator = new Facilitator();
  const handler = facilitator.getBillableHandler();
  if (handler.isLeft()) {
    throw new Error(
      `Failed to bootstrap the lambda function due to: ${handler.getLeft()}`,
    );
  }

  for (const record of event.Records) {
    await handler.getRight().handle(record);
  }
};
