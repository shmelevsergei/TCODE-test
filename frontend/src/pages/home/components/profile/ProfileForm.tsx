import { IProfile } from "@/types/profile"
import { useState } from "react"
import { Button } from "../../../../components/ui/button"
import { useProfileStore } from "@/store/profileStore"
import { Input } from "../../../../components/ui/input"
import { DialogFooter } from "../../../../components/ui/dialog"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface IInputForm {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  placeholder?: string
  type?: string
}

const InputForm = ({ onChange, value, placeholder, type }: IInputForm) => {
  return (
    <Input
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      type={type}
    />
  )
}

const ProfileForm = ({
  profile,
  setEditing,
}: {
  profile: IProfile
  setEditing: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [form, setForm] = useState(profile)
  const saveProfile = useProfileStore((state) => state.setProfile)
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: IProfile) => {
      const response = await fetch(
        `http://localhost:8000/users/${updatedProfile.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedProfile),
        }
      )

      if (!response.ok) {
        throw new Error("Ошибка обновления профиля")
      }

      setLoading(false)
      return response.json()
    },
    onSuccess: (data) => {
      saveProfile(data)
      queryClient.invalidateQueries({ queryKey: ["profile"] })
      toast("Профиль обновлён")
      setEditing(false)
    },
    onError: (error: Error) => {
      toast.error("Ошибка обновления профиля")
      console.error(error)
    },
  })

  const handleSave = () => {
    setLoading(true)
    updateProfileMutation.mutate(form)
  }

  return (
    <div className="grid gap-0.5">
      <InputForm
        value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        placeholder="Имя"
      />
      <InputForm
        value={form.lastName}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        placeholder="Фамилия"
      />
      <InputForm
        value={form.birthDate}
        onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
        type="date"
      />
      <InputForm
        value={form.about || ""}
        onChange={(e) => setForm({ ...form, about: e.target.value })}
        placeholder="О себе"
      />
      <InputForm
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        type="email"
        placeholder="Email"
      />
      <InputForm
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="Телефон"
      />
      <DialogFooter>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить"}
        </Button>
      </DialogFooter>
    </div>
  )
}

export default ProfileForm
