import { DynamoDBRecord } from 'aws-lambda';

import { BillableProcessStatus } from './common/billable-process-status.enum';
import { Either } from './common/either';
import { CanSkipException } from './exceptions/can-skip.exception';
import { ContextAwareException } from './exceptions/context-aware.exception';

export class Validator {
  static isEligible(
    record: DynamoDBRecord,
  ): Either<ContextAwareException, DynamoDBRecord> {
    const eventName = record.eventName || '';
    const processStatus = record.dynamodb?.NewImage?.process_status.S;

    return ['INSERT', 'MODIFY'].includes(eventName) &&
      processStatus !== undefined &&
      processStatus.toLowerCase() === BillableProcessStatus.Pending
      ? Either.right(record)
      : Either.left(CanSkipException.create());
  };
}
