import { useEffect, useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader } from "../../../../components/ui/card"
import { Input } from "../../../../components/ui/input"
import { Textarea } from "../../../../components/ui/textarea"
import { ArrowUpDown } from "lucide-react"
import { toast } from "sonner"
import PostItem from "../post-item/PostItem"
import { useProfileStore } from "@/store/profileStore"
import { IPost } from "@/types/post"

const API_URL = "http://localhost:8000/posts"

const PostList = () => {
  const profile = useProfileStore((state) => state.profile)

  const [posts, setPosts] = useState<IPost[]>([])
  const [newPost, setNewPost] = useState("")
  const [postImages, setPostImages] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState("new")
  const [visiblePosts, setVisiblePosts] = useState(3)
  const [files, setFiles] = useState<File[]>([])
  const [totalCount, setTotalCount] = useState(0)

  const fetchPosts = async (page = 1) => {
    try {
      const response = await fetch(
        `${API_URL}?page=${page}&limit=${visiblePosts}`,
        {
          credentials: "include",
        }
      )
      if (!response.ok) throw new Error("Ошибка загрузки постов")

      const resData = await response.json()
      const data = resData.posts
      const totalCount = resData.totalCount

      if (Array.isArray(data)) {
        const postsData = data.map((post) => {
          return {
            id: post.id,
            text: post.text,
            date: post.createdAt,
            images: Array.isArray(post.images)
              ? post.images.map(
                  (image: string) => `http://localhost:8000/${image}`
                )
              : [],
            user: {
              id: post.userId,
            },
          }
        })

        setPosts((prev) => (page === 1 ? postsData : [...prev, ...postsData]))
        setTotalCount(totalCount)
      } else {
        throw new Error("Ответ не является массивом")
      }
    } catch (error) {
      toast("Ошибка при загрузке постов")
      console.error(error)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [visiblePosts])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFiles(files)
    const imagesArray = files.map((file) => URL.createObjectURL(file))
    setPostImages(imagesArray)
  }

  const handleAddPost = async () => {
    if (newPost.trim() === "") return

    const formData = new FormData()
    formData.append("text", newPost)
    files.forEach((image) => formData.append("file", image))

    try {
      const response = await fetch(`${API_URL}?userId=${profile.id}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      if (!response.ok) throw new Error("Ошибка создания поста")

      setNewPost("")
      setPostImages([])
      setFiles([])
      toast("Пост создан!")

      fetchPosts()
    } catch (error) {
      toast("Ошибка при создании поста")
      console.error(error)
    }
  }

  const handleDeletePost = async (postId: number) => {
    try {
      const response = await fetch(`${API_URL}/${postId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) throw new Error("Ошибка при удалении поста")

      setPosts(posts.filter((post) => post.id !== postId))
      toast("Пост удален")
    } catch (error) {
      toast("Ошибка при удалении поста")
      console.error(error)
    }
  }

  const sortedPosts = [...posts].sort((a, b) =>
    sortOrder === "new"
      ? +new Date(b.date) - +new Date(a.date)
      : +new Date(a.date) - +new Date(b.date)
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Лента постов</h2>
          <Button
            className="min-w-28 justify-start cursor-pointer"
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "new" ? "old" : "new")}
          >
            <ArrowUpDown /> {sortOrder === "new" ? "Новые" : "Старые"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Напишите новый пост..."
        />
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-2"
        />
        <div className="flex flex-wrap mt-2">
          {postImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="preview"
              className="w-16 h-16 object-cover mr-2"
            />
          ))}
        </div>
        <Button onClick={handleAddPost} className="mt-2">
          Добавить пост
        </Button>

        <div className="mt-4">
          {sortedPosts.slice(0, visiblePosts).map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onDelete={handleDeletePost}
              canEdit={post.user.id === profile.id}
            />
          ))}
        </div>

        {visiblePosts < totalCount && (
          <Button
            className="mt-4"
            onClick={() => setVisiblePosts(visiblePosts + 3)}
          >
            Загрузить еще
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default PostList
