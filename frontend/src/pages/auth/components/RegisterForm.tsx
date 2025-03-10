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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

const formSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  birthDate: z.string(),
  password: z.string().min(6, {
    message: "Пароль должен быть не менее 6 символов",
  }),
})

export function RegisterForm({ className, setForm, ...props }: IFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      birthDate: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    if (res.status === 201) {
      form.setValue("email", "")
      form.setValue("firstName", "")
      form.setValue("lastName", "")
      form.setValue("phone", "")
      form.setValue("birthDate", "")
      form.setValue("password", "")

      setForm("login")
      toast("Аккаунт успешно создан")
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
            Регистрация
          </CardTitle>
          <CardDescription>
            Зарегистрируйте аккаунт, что войти в профиль.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3">
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
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Имя</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Иван"
                          required
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Фамилия</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Иванов"
                          required
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Телефон</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+79999999999"
                          required
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Дата рождения</FormLabel>
                      <FormControl>
                        <Input type="date" required {...field} />
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
                    Зарегистрироваться
                  </Button>
                </div>
              </div>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            Есть аккаунт?{" "}
            <Button
              onClick={() => setForm("login")}
              variant={"link"}
              className="underline underline-offset-4 cursor-pointer"
            >
              Войти
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
