import { Module } from "@nestjs/common";
import { WithdrawalUnitOfWork } from "./withdrawal.unit-of-work";
import { AccountModule } from "../modules/account/account.module";
import { TransactionModule } from "../modules/transaction/transaction.module";

@Module({
  imports: [AccountModule, TransactionModule],
  providers: [WithdrawalUnitOfWork],
  exports: [WithdrawalUnitOfWork],
})
export class UnitsOfWorkModule {}
