import type { EntityData } from "@mikro-orm/core"
import { faker } from "@faker-js/faker"
import { Factory } from "@mikro-orm/seeder"
import Transaction from "../../../../domain/entities/transaction.entity"
import TransactionFailureReason from "../../../../domain/enums/transaction-failure-reason.enum"
import TransactionStatus from "../../../../domain/enums/transaction-status.enum"
import TransactionType from "../../../../domain/enums/transaction-type.enum"

class TransactionFactory extends Factory<Transaction> {
  model = Transaction

  protected override definition(): EntityData<Transaction> {
    const status = faker.helpers.arrayElement([
      TransactionStatus.FAILED,
      TransactionStatus.PENDING,
      TransactionStatus.RETRYING,
      TransactionStatus.SUCCESS
    ])

    return {
      amount: parseFloat(faker.finance.amount({ min: 50000, max: 200000 })),
      type: faker.helpers.arrayElement([
        TransactionType.CANCELED,
        TransactionType.PAYMENT,
        TransactionType.REFUND,
        TransactionType.TOP_UP
      ]),
      status,
      failureReason:
        status === TransactionStatus.FAILED
          ? faker.helpers.arrayElement([
              TransactionFailureReason.BOOKING_INVALID,
              TransactionFailureReason.INSUFFICIENT_BALANCE,
              TransactionFailureReason.PAYMENT_TIMEOUT,
              TransactionFailureReason.SYSTEM_ERROR
            ])
          : null,
      notes: Math.random() > 0.5 ? faker.lorem.sentence() : null,
      retryCount: status === TransactionStatus.RETRYING ? faker.number.int({ min: 1, max: 3 }) : 0,
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent()
    }
  }
}

export default TransactionFactory
