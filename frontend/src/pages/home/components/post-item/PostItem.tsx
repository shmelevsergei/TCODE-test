import { IPost } from "@/types/post"
import { Card, CardContent } from "../../../../components/ui/card"
import { Textarea } from "../../../../components/ui/textarea"
import { useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

const API_URL = "http://localhost:8000/posts"

const PostItem = ({
  post,
  onDelete,
  canEdit,
}: {
  post: IPost
  onDelete: (postId: number) => void
  canEdit: boolean
}) => {
  const [editPostId, setEditPostId] = useState<number | null>(null)
  const [editPostText, setEditPostText] = useState(post.text)
  const [editPostImages, setEditPostImages] = useState<string[]>(
    post.images || []
  )
  const [files, setFiles] = useState<File[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...newFiles])

    const newImages = newFiles.map((file) => URL.createObjectURL(file))
    setEditPostImages((prevImages) => [...prevImages, ...newImages])
  }

  const handleDeleteImage = (idx: number) => {
    setEditPostImages((prevImages) => prevImages.filter((_, i) => i !== idx))
  }

  const handleEditPost = () => {
    setEditPostId(post.id)
  }

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData()
      formData.append("text", editPostText)
      files.forEach((file) => formData.append("file", file))

      const response = await fetch(`${API_URL}/${post.id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      })

      if (!response.ok) throw new Error("Ошибка при обновлении поста")

      setEditPostId(null)
      toast("Пост обновлен!")
    } catch (error) {
      toast("Ошибка при обновлении поста")
      console.error(error)
    }
  }

  // Удаление поста
  const handleDeletePost = async () => {
    try {
      const response = await fetch(`${API_URL}/${post.id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) throw new Error("Ошибка при удалении поста")

      onDelete(post.id)
      toast("Пост удален!")
    } catch (error) {
      toast("Ошибка при удалении поста")
      console.error(error)
    }
  }

  return (
    <Card className="mt-2">
      <CardContent>
        {editPostId === post.id ? (
          <>
            <Textarea
              value={editPostText}
              onChange={(e) => setEditPostText(e.target.value)}
            />
            <div className="mt-2">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="border p-2 rounded"
              />
              <div className="flex flex-wrap mt-2 gap-2">
                {editPostImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`preview-${idx}`}
                      className="w-24 h-24 object-cover"
                    />
                    <Button
                      className="absolute top-1 right-1 rounded-full cursor-pointer"
                      variant="outline"
                      onClick={() => handleDeleteImage(idx)}
                    >
                      ✖
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <Button className="mt-2 cursor-pointer" onClick={handleSaveEdit}>
              Сохранить
            </Button>
          </>
        ) : (
          <>
            <p>{post.text}</p>
            <div className="flex flex-wrap mt-2">
              {post.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="post"
                  className="w-24 h-24 object-cover mr-2"
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {new Date(post.date).toLocaleString()}
            </p>
            {canEdit && (
              <div className="flex gap-1.5 mt-2">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={handleEditPost}
                >
                  <Pencil />
                </Button>
                <Button variant="destructive" onClick={handleDeletePost}>
                  <Trash2 />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default PostItem
