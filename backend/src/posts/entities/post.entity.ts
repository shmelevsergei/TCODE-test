import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  text: string

  @Column("text", { array: true, nullable: true })
  images: string[]

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

  @Column({ name: "user_id" })
  userId: number

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date()
  }
}
