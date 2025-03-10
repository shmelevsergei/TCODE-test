import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { PostsService } from "./posts.service"
import { CreatePostDto } from "./dto/create-post.dto"
import { UpdatePostDto } from "./dto/update-post.dto"
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from "@nestjs/platform-express"
import { createMulterStorage } from "src/images/storage"
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from "@nestjs/swagger"

const storage = createMulterStorage()

@ApiTags("Posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "file" }], {
      storage,
    })
  )
  @ApiOperation({ summary: "Создать пост" })
  @ApiResponse({ status: 201, description: "Пост создан" })
  @ApiResponse({ status: 400, description: "Ошибка валидации" })
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Query("userId") userId: number,
    @UploadedFiles() files: { file?: Express.Multer.File[] }
  ) {
    const newPost = await this.postService.createPost(
      createPostDto,
      userId,
      files
    )
    return { message: "Пост создан", newPost }
  }

  @Delete(":postId")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Удалить пост" })
  @ApiResponse({ status: 200, description: "Пост удалён" })
  @ApiResponse({ status: 404, description: "Пост не найден" })
  @ApiParam({ name: "postId", description: "ID поста" })
  async deletePost(@Param("postId") postId: number) {
    await this.postService.deletePost(postId)
    return { message: "Пост удалён" }
  }

  @Put(":postId")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Обновить пост" })
  @ApiResponse({ status: 200, description: "Пост обновлён" })
  @ApiResponse({ status: 404, description: "Пост не найден" })
  @ApiParam({ name: "postId", description: "ID поста" })
  async updatePost(
    @Param("postId") postId: number,
    @Body() updatePostDto: UpdatePostDto
  ) {
    const updatedPost = await this.postService.updatePost(postId, updatePostDto)
    return { message: "Пост обновлён", updatedPost }
  }

  @Get()
  @ApiOperation({ summary: "Получить список постов (с пагинацией)" })
  @ApiResponse({ status: 200, description: "Список постов" })
  @ApiQuery({ name: "page", description: "Номер страницы", required: false })
  @ApiQuery({
    name: "limit",
    description: "Количество постов на странице",
    required: false,
  })
  async getPosts(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    const { posts, totalCount } = await this.postService.getPosts(page, limit)

    console.log("posts", posts.length)

    return { posts, totalCount }
  }

  @Post(":postId/image")
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor("file", { storage }))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Добавить изображение к посту" })
  @ApiResponse({ status: 200, description: "Изображение добавлено к посту" })
  @ApiResponse({ status: 404, description: "Пост не найден" })
  @ApiParam({ name: "postId", description: "ID поста" })
  @ApiConsumes("multipart/form-data")
  async addImageToPost(
    @Param("postId") postId: number,
    @UploadedFile() file: Express.Multer.File
  ) {
    const updatedPost = await this.postService.addImageToPost(postId, file)
    return { message: "Изображение добавлено к посту", updatedPost }
  }

  @Put(":postId/image")
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor("file", { storage }))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Обновить изображение поста" })
  @ApiResponse({ status: 200, description: "Изображение обновлено" })
  @ApiResponse({ status: 404, description: "Пост не найден" })
  @ApiParam({ name: "postId", description: "ID поста" })
  @ApiConsumes("multipart/form-data")
  async updateImageForPost(
    @Param("postId") postId: number,
    @UploadedFile() file: Express.Multer.File
  ) {
    const updatedPost = await this.postService.updateImageForPost(postId, file)
    return { message: "Изображение обновлено для поста", updatedPost }
  }
}
