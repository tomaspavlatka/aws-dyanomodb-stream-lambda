import type { DynamoDBStreamEvent } from 'aws-lambda';

import { Facilitator } from './common/facilitator';
import { ErrorCode } from './exceptions/error-code.enum';

export const handler = async (event: DynamoDBStreamEvent) => {
  const facilitator = new Facilitator();
  const handler = facilitator.getBillableHandler();
  if (handler.isLeft()) {
    throw new Error(
      `Failed to bootstrap the lambda function due to: ${handler.getLeft()}`,
    );
  }

  for (const record of event.Records) {
    console.log('processing event id:', record.eventID!);

    (await handler.getRight().handle(record))
      .mapLeft((error) => {
        // CanSkip is a special use case as it says that the record can be skipped
        // we therefore just log an information about that
        if (error.errorCode == ErrorCode.CanSkip) {
          console.log('skipping');
        } else {
          console.error('error while processing', JSON.stringify(error));
        }

        return error;
      })
      .mapRight(() => {
        console.log('processed');
        return null;
      });
  }
};
