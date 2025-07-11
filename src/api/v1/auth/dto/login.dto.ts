import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ description: "The username of the user", example: "john_doe" })
  username: string;

  @ApiProperty({ description: "The password of the user", example: "securePassword123" })
  password: string;
}
