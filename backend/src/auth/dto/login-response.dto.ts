import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class LoginResponseDto {
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  @IsString()
  access_token: string
}
