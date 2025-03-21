import {
  DynamoDBClient,
  ReturnValue,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';

import { BillableProcessStatus } from '../common/billable-process-status.enum';
import { Billable, Invoice } from '../common/contracts';
import { Either } from '../common/either';
import { ContextAwareException } from '../exceptions/context-aware.exception';
import { PersistenceLayerException } from '../exceptions/persistence-layer.exception';

export class PersistenceFacade {
  constructor(
    private readonly dbClient: DynamoDBClient,
    private readonly tableName: string,
  ) {}

  async markAsCreated(
    billable: Billable,
    invoice: Invoice,
  ): Promise<Either<ContextAwareException, null>> {
    const params = {
      TableName: this.tableName,
      Key: {
        id: { S: billable.id },
      },
      UpdateExpression:
        'SET process_status = :newStatus, external_id = :newExternalId, updated_at = :newUpdatedAt',
      ExpressionAttributeValues: {
        ':newStatus': { S: BillableProcessStatus.Created },
        ':newExternalId': { S: '' + invoice.id },
        ':newUpdatedAt': { S: new Date().toISOString() },
      },
      ReturnValues: ReturnValue.ALL_NEW,
    };

    try {
      await this.dbClient.send(new UpdateItemCommand(params));
      return Either.right(null);
    } catch (error) {
      return Either.left(
        PersistenceLayerException.create(JSON.stringify(error)),
      );
    }
  }
}
