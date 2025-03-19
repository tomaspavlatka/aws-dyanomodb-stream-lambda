import { DynamoDBRecord } from "aws-lambda";
import { Either } from "./either";
import { ContextAwareException } from "./exceptions/context-aware.exception";
import { MissingValueException } from "./exceptions/missing-value.exception";

export const toBillable = (
  record: DynamoDBRecord,
): Either<ContextAwareException, Billable> => {
  const id = record.dynamodb?.NewImage?.id.S;
  if (!id) {
    throw Either.left(
      MissingValueException.create("id", JSON.stringify(record.dynamodb!)),
    );
  }

  const companyId = record.dynamodb?.NewImage?.company_id.S;
  if (!companyId) {
    throw Either.left(
      MissingValueException.create(
        "company_id",
        JSON.stringify(record.dynamodb!),
      ),
    );
  }

  const payload = record.dynamodb?.NewImage?.payload.S;
  if (!payload) {
    throw Either.left(
      MissingValueException.create("payable", JSON.stringify(record.dynamodb!)),
    );
  }

  const payable: Payable[] = JSON.parse(payload);

  return Either.right({ id, companyId, payable, externalId: "" });
};
