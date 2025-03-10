import { useState } from "react"
import { LoginForm } from "./components/LoginForm"
import { RegisterForm } from "./components/RegisterForm"

const AuthPage = () => {
  const [isLoginForm, setIsLoginForm] = useState<"login" | "register">("login")
  return (
    <div className="flex w-full min-h-full justify-center items-center">
      <div className="max-w-lg mx-auto">
        {isLoginForm === "login" ? (
          <LoginForm setForm={setIsLoginForm} />
        ) : (
          <RegisterForm setForm={setIsLoginForm} />
        )}
      </div>
    </div>
  )
}

export default AuthPage
