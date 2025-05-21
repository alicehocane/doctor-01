"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  setPersistence, 
  browserLocalPersistence 
} from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mostrarFormularioReset, setMostrarFormularioReset] = useState(false)
  const [emailReset, setEmailReset] = useState("")
  const [resetEnviado, setResetEnviado] = useState(false)

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await setPersistence(auth, browserLocalPersistence)
      await signInWithEmailAndPassword(auth, email, password)

      // Configurar cookie de sesión
      document.cookie = `sesion=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict;`

      // Redirigir al panel de administración
      router.push("/admin")
    } catch (error: any) {
      console.error("Error de login:", error)
      if (error.code === "auth/invalid-credential") {
        setError("Credenciales inválidas. Por favor verifica tu correo y contraseña.")
      } else if (error.code === "auth/too-many-requests") {
        setError("Demasiados intentos fallidos. Por favor intenta más tarde.")
      } else {
        setError(`Error al iniciar sesión: ${error.message || error.code || "Error desconocido"}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const manejarResetContraseña = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, emailReset)
      setResetEnviado(true)
    } catch (error: any) {
      console.error("Error al resetear contraseña:", error)
      if (error.code === "auth/user-not-found") {
        setError("No se encontró una cuenta con este correo electrónico.")
      } else {
        setError(`Error al restablecer contraseña: ${error.message || error.code || "Error desconocido"}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 gap-4">
      <Card className="w-full max-w-md">
        {mostrarFormularioReset ? (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Restablecer Contraseña</CardTitle>
              <CardDescription>
                Ingresa tu correo electrónico para recibir un enlace de restablecimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {resetEnviado ? (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Se ha enviado un correo para restablecer la contraseña a {emailReset}. Por favor revisa tu bandeja de entrada.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={manejarResetContraseña} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-reset">Correo Electrónico</Label>
                    <Input
                      id="email-reset"
                      type="email"
                      placeholder="admin@ejemplo.com"
                      value={emailReset}
                      onChange={(e) => setEmailReset(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Enlace"}
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                variant="link" 
                onClick={() => {
                  setMostrarFormularioReset(false)
                  setResetEnviado(false)
                  setEmailReset("")
                }}
              >
                Volver al inicio de sesión
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
              <CardDescription>Ingresa tus credenciales para acceder al panel de administración</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={manejarLogin} className="space-y-4">
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto" 
                      type="button"
                      onClick={() => setMostrarFormularioReset(true)}
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">Panel de administración - solo personal autorizado</p>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}