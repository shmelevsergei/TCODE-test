import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthContextProvider } from "@/hooks/useAuth"
import { Toaster } from "@/components/ui/sonner"
import RouterPages from "@/router/RouterPages"

const queryClient = new QueryClient()
function App() {
  return (
    <AuthContextProvider>
      <main className="py-10 h-dvh">
        <QueryClientProvider client={queryClient}>
          <RouterPages />
        </QueryClientProvider>
        <Toaster />
      </main>
    </AuthContextProvider>
  )
}

export default App
