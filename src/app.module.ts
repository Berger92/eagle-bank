import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AuthModule, JwtAuthGuard } from "@v1/auth";
import { UserModule } from "@v1/user";

@Module({
  controllers: [AppController],
  imports: [AuthModule, UserModule, ConfigModule.forRoot({ isGlobal: true, cache: true })],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
