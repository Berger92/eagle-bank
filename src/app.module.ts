import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AuthModule } from "./api/v1/auth/auth.module";
import { UserModule } from "./api/v1/user/user.module";

@Module({
  controllers: [AppController],
  imports: [AuthModule, UserModule],
})
export class AppModule {}
