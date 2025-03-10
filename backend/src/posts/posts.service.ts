import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Post } from "./entities/post.entity"
import { ImagesService } from "src/images/images.service" // Сервис для работы с изображениями
import { CreatePostDto } from "./dto/create-post.dto"
import { UpdatePostDto } from "./dto/update-post.dto"
import { User } from "src/users/entities/user.entity"
import { UsersService } from "src/users/users.service"

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly imagesService: ImagesService
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    userId: number,
    files: { file?: Express.Multer.File[] }
  ): Promise<Post> {
    const images = files.file?.map((file) => file.path)

    const newPost = this.postRepository.create({
      text: createPostDto.text,
      images: images,
      userId: userId,
    })

    const createdPost = await this.postRepository.save(newPost)
    return createdPost
  }

  async deletePost(postId: number): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    })

    if (!post) {
      throw new NotFoundException("Пост не найден")
    }

    if (post.images && post.images.length > 0) {
      for (const image of post.images) {
        await this.imagesService.deleteImage(image)
      }
    }

    await this.postRepository.delete(postId)
  }

  async updatePost(
    postId: number,
    updatePostDto: UpdatePostDto
  ): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id: postId } })

    if (!post) {
      throw new NotFoundException("Пост не найден")
    }

    post.text = updatePostDto.text || post.text
    post.images = updatePostDto.images || post.images

    post.updatedAt = new Date()

    return await this.postRepository.save(post)
  }

  async getPosts(
    page: number,
    limit: number
  ): Promise<{ posts: Post[]; totalCount: number }> {
    const [posts, count] = await this.postRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    })

    return { posts, totalCount: count }
  }

  async addImageToPost(
    postId: number,
    file: Express.Multer.File
  ): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id: postId } })

    if (!post) {
      throw new NotFoundException("Пост не найден")
    }

    const imagePath = await this.imagesService.uploadImage(file)

    post.images.push(imagePath)

    return await this.postRepository.save(post)
  }

  async updateImageForPost(
    postId: number,
    file: Express.Multer.File
  ): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id: postId } })

    if (!post) {
      throw new NotFoundException("Пост не найден")
    }

    if (post.images && post.images.length > 0) {
      await this.imagesService.deleteImage(post.images[0])
      post.images = []
    }

    const imagePath = await this.imagesService.uploadImage(file)

    post.images.push(imagePath)

    return await this.postRepository.save(post)
  }
}
