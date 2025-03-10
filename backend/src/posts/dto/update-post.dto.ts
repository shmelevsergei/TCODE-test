import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsArray, IsOptional, IsString } from "class-validator"

export class UpdatePostDto {
  @ApiPropertyOptional({
    description: "Новый текст поста",
    example: "Я обновил свой пост!",
  })
  @IsString()
  @IsOptional()
  text?: string

  @ApiPropertyOptional({
    description: "Обновленный список изображений (URL-адреса)",
    example: [
      "https://example.com/new-image1.jpg",
      "https://example.com/new-image2.jpg",
    ],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  images?: string[]
}
