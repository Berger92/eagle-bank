import { Module } from "@nestjs/common";
import { UnitOfWorkModule } from "@v1/modules/units-of-work";
import { AccountModule } from "@v1/modules/account";
import { UserModule } from "@v1/modules/user";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";
import { TransactionRepository } from "./transaction.repository";
import { TransactionMapper } from "./transaction.mapper";

@Module({
  imports: [AccountModule, UserModule, UnitOfWorkModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository, TransactionMapper],
  exports: [TransactionService, TransactionRepository, TransactionMapper],
})
export class TransactionModule {}
