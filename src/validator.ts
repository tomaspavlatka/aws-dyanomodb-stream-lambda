import { DynamoDBRecord } from "aws-lambda";
import { Either } from "./either";
import { ContextAwareException } from "./exceptions/context-aware.exception";
import { CanSkipException } from "./exceptions/can-skip.exception";

export const isEligible = (record: DynamoDBRecord): Either<ContextAwareException, DynamoDBRecord> => {
  const eventName = record.eventName || '';
  const status = record.dynamodb?.NewImage?.status.S;

  return ['INSERT', 'MODIFY'].includes(eventName) && status !== undefined && status.toLowerCase() === 'pending'
    ? Either.right(record)
    : Either.left(CanSkipException.create());
}
