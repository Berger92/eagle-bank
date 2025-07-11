import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { LocalStrategy } from "./local.strategy";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret:
        "DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.",
      signOptions: { expiresIn: "1h" },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
