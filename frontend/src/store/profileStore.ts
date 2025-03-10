import { IProfile } from "@/types/profile"
import { create } from "zustand"

interface IState {
  profile: IProfile
  setProfile: (profile: IProfile) => void
}

export const useProfileStore = create<IState>((set) => ({
  profile: {
    id: 1,
    avatar: "https://github.com/shadcn.png",
    firstName: "Иван",
    lastName: "Иванов",
    birthDate: "1990-01-01",
    about: "О себе",

    phone: "+7 999 123-45-67",
    email: "ivanov@example.com",
  },
  setProfile: (profile: IProfile) => set({ profile }),
}))
