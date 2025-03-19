import { DynamoDBRecord } from "aws-lambda";
import { Either } from "./either";
import { ContextAwareException } from "./exceptions/context-aware.exception";
import { CanSkipException } from "./exceptions/can-skip.exception";
import { BillableProcessStatus } from "./billable-process-status.enum";

export const isEligible = (record: DynamoDBRecord): Either<ContextAwareException, DynamoDBRecord> => {
  const eventName = record.eventName || '';
  const processStatus = record.dynamodb?.NewImage?.process_status.S;

  return ['INSERT', 'MODIFY'].includes(eventName)
    && processStatus !== undefined
    && processStatus.toLowerCase() === BillableProcessStatus.Pending
    ? Either.right(record)
    : Either.left(CanSkipException.create());
}
