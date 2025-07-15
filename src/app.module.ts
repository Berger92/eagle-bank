import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { AuthModule, JwtAuthGuard } from "@v1/auth";
import { UserModule } from "@v1/user";
import { AccountModule } from "@v1/account";
import { TransactionModule } from "@v1/transaction";
import { SharedModule } from "@shared/shared.module";
import { AppController } from "./app.controller";

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    SharedModule,
    AuthModule,
    UserModule,
    AccountModule,
    TransactionModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
