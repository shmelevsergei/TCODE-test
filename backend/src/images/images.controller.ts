import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Put,
} from "@nestjs/common"
import { ImagesService } from "./images.service"
import { FileInterceptor } from "@nestjs/platform-express"
import { createMulterStorage } from "./storage"
import { AuthGuard } from "@nestjs/passport"
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger"

const storage = createMulterStorage()

@ApiTags("Images")
@ApiBearerAuth()
@Controller("images")
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post("upload")
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor("file", { storage }))
  @ApiOperation({ summary: "Загрузить изображение" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 201, description: "Изображение успешно загружено" })
  @ApiResponse({ status: 400, description: "Недопустимый формат файла" })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return { url: await this.imagesService.uploadImage(file) }
  }

  @Delete(":fileName")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Удалить изображение" })
  @ApiParam({ name: "fileName", description: "Имя файла изображения" })
  @ApiResponse({ status: 200, description: "Изображение удалено" })
  @ApiResponse({ status: 404, description: "Файл не найден" })
  async deleteImage(@Param("fileName") imageName: string) {
    await this.imagesService.deleteImage(imageName)
    return { message: "Изображение удалёно" }
  }

  @Put(":fileName")
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor("file", { storage }))
  @ApiOperation({ summary: "Обновить изображение" })
  @ApiConsumes("multipart/form-data")
  @ApiParam({ name: "fileName", description: "Имя файла изображения" })
  @ApiResponse({ status: 200, description: "Изображение обновлено" })
  @ApiResponse({ status: 404, description: "Файл не найден" })
  async updateImage(
    @Param("fileName") imageName: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    await this.imagesService.updateImage(imageName, file)
    return { message: "Изображение обновлено" }
  }
}
