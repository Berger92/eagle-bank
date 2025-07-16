import { Module } from "@nestjs/common";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { AccountRepository } from "./account.repository";
import { AccountMapper } from "./account.mapper";

@Module({
  controllers: [AccountController],
  providers: [AccountService, AccountRepository, AccountMapper],
  exports: [AccountService, AccountRepository, AccountMapper],
})
export class AccountModule {}
