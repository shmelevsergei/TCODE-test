import { Image } from "src/images/entities/image.entity"
import { Post } from "src/posts/entities/post.entity"
import {
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
    type: "timestamp",
  })
  createdAt: Date

  @Column({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date

  @Column({ name: "first_name" })
  firstName: string

  @Column({ name: "last_name" })
  lastName: string

  @Column({ name: "birth_date" })
  birthDate: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column()
  phone: string

  @Column({ nullable: true })
  about?: string

  @Column({ nullable: true })
  avatar?: string

  @Column({ type: "text", nullable: true, name: "refresh_token" })
  refreshToken?: string | null

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date()
  }
}
