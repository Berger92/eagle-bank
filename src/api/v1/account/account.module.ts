import { Module } from "@nestjs/common";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { AccountRepository } from "@v1/account/account.repository";

@Module({
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
})
export class AccountModule {}
