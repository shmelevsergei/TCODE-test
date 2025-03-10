export interface IPost {
  id: number
  text: string
  date: string
  images: string[]
  user: {
    id: number
  }
}
export interface IUpdatePost extends Omit<IPost, "id"> {}
