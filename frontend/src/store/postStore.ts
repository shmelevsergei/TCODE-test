import { IPost, IUpdatePost } from "@/types/post"
import { create } from "zustand"

interface IState {
  posts: IPost[]
  addPost: (post: IPost) => void
  deletePost: (id: number) => void
  editPost: (id: number | null, updatedPost: IUpdatePost) => void
}

export const usePostStore = create<IState>((set) => ({
  posts: [],
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  deletePost: (id) =>
    set((state) => ({ posts: state.posts.filter((p) => p.id !== id) })),
  editPost: (id, updatedPost) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === id ? { ...p, ...updatedPost } : p
      ),
    })),
}))
