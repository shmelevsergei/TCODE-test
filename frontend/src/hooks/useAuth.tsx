import { useProfileStore } from "@/store/profileStore"
import { IProfile } from "@/types/profile"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  checkAuth: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const setProfile = useProfileStore((state) => state.setProfile)

  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:8000/auth/me", {
        method: "GET",
        credentials: "include",
      })

      if (res.ok) {
        setIsAuthenticated(true)
        const data = (await res.json()) as IProfile

        const avaterImage = `http://localhost:8000${data.avatar}`

        const user = {
          ...data,
          avatar: avaterImage,
        }

        setProfile(user)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Ошибка проверки аутентификации:", error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      credentials: "include",
    })
    setIsAuthenticated(false)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, checkAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context)
    throw new Error("useAuth должен быть внутри AuthContextProvider")
  return context
}
