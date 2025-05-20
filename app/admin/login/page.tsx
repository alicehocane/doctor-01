"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [isResetMode, setIsResetMode] = useState(false)

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Sign in with Supabase
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      // Redirect to admin dashboard
      router.push("/admin")
      router.refresh()
    } catch (error: any) {
      console.error("Login error:", error)

      // Handle different Supabase auth errors
      if (error.message.includes("Invalid login")) {
        setError("Credenciales inválidas. Por favor, verifica tu correo y contraseña.")
      } else if (error.message.includes("rate limit")) {
        setError("Demasiados intentos fallidos. Por favor, intenta más tarde.")
      } else {
        setError(`Error al iniciar sesión: ${error.message || "Unknown error"}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })

      if (error) throw error

      setResetSent(true)
    } catch (error: any) {
      console.error("Password reset error:", error)
      setError(`Error al enviar el correo de recuperación: ${error.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 gap-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {isResetMode ? "Recuperar Contraseña" : "Iniciar Sesión"}
          </CardTitle>
          <CardDescription>
            {isResetMode
              ? "Ingresa tu correo electrónico para recibir un enlace de recuperación"
              : "Ingresa tus credenciales para acceder al panel de administración"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {resetSent && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>
                Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={isResetMode ? handlePasswordReset : handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {!isResetMode && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm"
                    type="button"
                    onClick={() => setIsResetMode(true)}
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? isResetMode
                  ? "Enviando..."
                  : "Iniciando sesión..."
                : isResetMode
                  ? "Enviar correo de recuperación"
                  : "Iniciar Sesión"}
            </Button>

            {isResetMode && (
              <Button type="button" variant="outline" className="w-full" onClick={() => setIsResetMode(false)}>
                Volver al inicio de sesión
              </Button>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">Panel de administración exclusivo para personal autorizado</p>
        </CardFooter>
      </Card>
    </div>
  )
}
