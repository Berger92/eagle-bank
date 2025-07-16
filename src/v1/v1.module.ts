import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth";
import { UserModule } from "./modules/user";
import { AccountModule } from "./modules/account";
import { TransactionModule } from "./modules/transaction";
import { UnitOfWorkModule } from "./modules/units-of-work";

@Module({
  imports: [AuthModule, UserModule, AccountModule, TransactionModule, UnitOfWorkModule],
})
export class V1Module {}
