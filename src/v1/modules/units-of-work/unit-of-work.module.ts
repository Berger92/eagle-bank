import { Module } from "@nestjs/common";
import { WithdrawalUnitOfWork } from "./withdrawal.unit-of-work";

@Module({
  providers: [WithdrawalUnitOfWork],
  exports: [WithdrawalUnitOfWork],
})
export class UnitOfWorkModule {}
