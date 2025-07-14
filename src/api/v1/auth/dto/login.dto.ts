import { ApiProperty } from "@nestjs/swagger";

export class LoginRequest {
  @ApiProperty({ description: "The username of the user", example: "john_doe" })
  username: string;

  @ApiProperty({ description: "The password of the user", example: "securePassword123" })
  password: string;
}

export class LoginResponse {
  @ApiProperty({
    description: "The access token for the authenticated user.",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  access_token: string;
}
