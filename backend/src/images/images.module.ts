import { Module } from "@nestjs/common"
import { ImagesService } from "./images.service"
import { ImagesController } from "./images.controller"

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
