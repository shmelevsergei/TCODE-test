import { useProfileStore } from "@/store/profileStore"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../../../components/ui/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar"
import { useState } from "react"
import { Button } from "../../../../components/ui/button"
import ProfileForm from "./ProfileForm"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import { IProfile } from "@/types/profile"

const Profile = () => {
  const profile = useProfileStore((state) => state.profile)
  const setProfile = useProfileStore((state) => state.setProfile)

  const [editing, setEditing] = useState(false)

  const { logout } = useAuth()

  if (!profile) {
    return <div>Загрузка...</div>
  }

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (file) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const response = await fetch(
          `http://localhost:8000/users/${profile.id}/avatar`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        )

        if (!response.ok) {
          throw new Error("Ошибка загрузки аватара")
        }

        const data = await response.json()

        const url = `http://localhost:8000${data.avatar}`

        const user = {
          ...data,
          avatar: url,
        } as IProfile

        setProfile(user)

        toast.success("Аватар обновлен")
      } catch (error) {
        toast.error("Ошибка при загрузке аватара")
        console.error(error)
      }
    }
  }

  const logoutHandler = () => {
    logout()
  }

  return (
    <Card className="w-full md:w-80 sm:shrink-0">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="w-max">
          <label htmlFor="upload-avatar" className="cursor-pointer block">
            <Avatar className="w-24 h-24 rounded-xl">
              <AvatarImage src={profile.avatar} alt="avatar" />

              <AvatarFallback>TC</AvatarFallback>
            </Avatar>
          </label>
          <form
            encType="multipart/form-data"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              id="upload-avatar"
              name="avatar"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </form>
        </div>
        <h2 className="flex flex-col font-bold">
          <span>{profile.firstName}</span>
          <span>{profile.lastName}</span>
        </h2>
      </CardHeader>
      <CardContent>
        <div>
          <p>Дата рождения: {profile.birthDate}</p>
          <p>{profile.about}</p>
          <p>Email: {profile.email}</p>
          <p>Телефон: {profile.phone}</p>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-3 items-start">
        <Dialog open={editing} onOpenChange={setEditing}>
          <DialogTrigger asChild>
            <Button variant={"outline"}>Редактировать профиль</Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[425px] "
            aria-describedby={undefined}
          >
            <DialogHeader>
              <DialogTitle>Редактироать профиль</DialogTitle>
            </DialogHeader>
            <ProfileForm profile={profile} setEditing={setEditing} />
          </DialogContent>
        </Dialog>

        <Button onClick={logoutHandler}>Выход</Button>
      </CardFooter>
    </Card>
  )
}

export default Profile
