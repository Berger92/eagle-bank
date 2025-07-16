import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth";
import { UserModule } from "./modules/user";
import { AccountModule } from "./modules/account";
import { TransactionModule } from "./modules/transaction";
import { UnitsOfWorkModule } from "./units-of-work/units-of-work.module";

@Module({
  imports: [AuthModule, UserModule, AccountModule, TransactionModule, UnitsOfWorkModule],
})
export class V1Module {}
