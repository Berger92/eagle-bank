import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { SharedModule } from "@shared/shared.module";
import { V1Module } from "@v1/v1.module";
import { JwtAuthGuard } from "@v1/modules/auth";
import { AppController } from "./app.controller";

@Module({
  controllers: [AppController],
  imports: [ConfigModule.forRoot({ isGlobal: true, cache: true }), SharedModule, V1Module],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
