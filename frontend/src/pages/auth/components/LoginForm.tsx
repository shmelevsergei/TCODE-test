import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { IFormProps } from "../types/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { useProfileStore } from "@/store/profileStore"
import { IProfile } from "@/types/profile"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Пароль должен быть не менее 6 символов",
  }),
})

export function LoginForm({ className, setForm, ...props }: IFormProps) {
  const { checkAuth } = useAuth()
  const setProfile = useProfileStore((state) => state.setProfile)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(values),
    })
    if (res.status === 201) {
      form.setValue("email", "")
      form.setValue("password", "")

      await checkAuth()

      toast("Вы вошли в аккаунт")

      const data = (await res.json()).user as IProfile

      const imageUrl = `http://localhost:8000${data.avatar}`

      const profile = {
        ...data,
        avatar: imageUrl,
      }

      setProfile(profile)
    } else {
      const data = await res.json()

      alert(data.message)

      return await res.json()
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            Вход в профиль
          </CardTitle>
          <CardDescription>
            Введите ваш email и пароль, чтобы войти в свой аккаунт.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          required
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <Input type="password" required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full cursor-pointer">
                    Войти
                  </Button>
                </div>
              </div>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            Нет аккаунта?{" "}
            <Button
              onClick={() => setForm("register")}
              variant={"link"}
              className="underline underline-offset-4 cursor-pointer"
            >
              Регистрация
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
