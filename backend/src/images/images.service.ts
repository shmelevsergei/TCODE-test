import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import * as path from "path"
import * as fs from "fs"

@Injectable()
export class ImagesService {
  private uploadPath = path.join(process.cwd(), "uploads")
  private allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ]
  private allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]

  constructor() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true })
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new NotFoundException("Файл не был загружен")
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        "Недопустимый формат файла. Разрешены только изображения."
      )
    }

    const fileExt = path.extname(file.originalname).toLowerCase()
    if (!this.allowedExtensions.includes(fileExt)) {
      throw new BadRequestException("Недопустимое расширение файла.")
    }

    const filePath = `/uploads/${file.filename}`

    return filePath
  }

  async deleteImage(fileName: string): Promise<void> {
    const filePath = path.join(this.uploadPath, fileName)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    } else {
      throw new NotFoundException("Файл не найден")
    }
  }

  async updateImage(
    fileName: string,
    file: Express.Multer.File
  ): Promise<string> {
    if (fileName) {
      await this.deleteImage(fileName)
    }

    return this.uploadImage(file)
  }
}
