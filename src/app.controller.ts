import { Controller, Get } from "@nestjs/common";
import { Public } from "./shared/decorators/public.decorator";

@Controller()
export class AppController {
  @Get("ping")
  @Public()
  home(): string {
    return "pong";
  }
}
