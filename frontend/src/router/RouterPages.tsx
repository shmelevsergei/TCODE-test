import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { JSX } from "react"
import HomePage from "@/pages/home/HomePage"
import AuthPage from "@/pages/auth/AuthPage"

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div>Загрузка...</div>
  return isAuthenticated ? children : <Navigate to="/auth" />
}

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div>Загрузка...</div>
  return isAuthenticated ? <Navigate to="/" /> : children
}

const RouterPages = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default RouterPages
