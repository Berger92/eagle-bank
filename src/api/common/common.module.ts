import { Module, Global } from "@nestjs/common";
import { PrismaService, PasswordService } from "./services";

@Global()
@Module({
  providers: [PrismaService, PasswordService],
  exports: [PrismaService, PasswordService],
})
export class CommonModule {}
