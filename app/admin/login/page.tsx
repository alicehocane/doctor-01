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
  getAuth,
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence,
  sendPasswordResetEmail 
} from "firebase/auth"
import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showResetForm, setShowResetForm] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [resetEmail, setResetEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await setPersistence(auth, browserLocalPersistence)
      await signInWithEmailAndPassword(auth, email, password)
      document.cookie = `session=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict;`
      router.push("/admin")
    } catch (error: any) {
      console.error("Login error:", error)
      if (error.code === "auth/invalid-credential") {
        setError("Credenciales inválidas. Por favor, verifica tu correo y contraseña.")
      } else if (error.code === "auth/too-many-requests") {
        setError("Demasiados intentos fallidos. Por favor, intenta más tarde.")
      } else {
        setError(`Error al iniciar sesión: ${error.message || error.code || "Unknown error"}`)
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
      await sendPasswordResetEmail(auth, resetEmail)
      setResetEmailSent(true)
    } catch (error: any) {
      console.error("Password reset error:", error)
      if (error.code === "auth/user-not-found") {
        setError("No existe una cuenta con este correo electrónico.")
      } else {
        setError(`Error al enviar el correo de restablecimiento: ${error.message || error.code || "Unknown error"}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 gap-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {showResetForm ? "Restablecer Contraseña" : "Iniciar Sesión"}
          </CardTitle>
          <CardDescription>
            {showResetForm 
              ? "Ingresa tu correo electrónico para recibir un enlace de restablecimiento" 
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

          {showResetForm ? (
            resetEmailSent ? (
              <div className="space-y-4">
                <Alert className="mb-4">
                  <AlertDescription>
                    Se ha enviado un correo electrónico a {resetEmail} con instrucciones para restablecer tu contraseña.
                  </AlertDescription>
                </Alert>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setShowResetForm(false)
                    setResetEmailSent(false)
                  }}
                >
                  Volver al inicio de sesión
                </Button>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Correo Electrónico</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="admin@ejemplo.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.preventDefault()
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button"  // Changed to button to prevent form submission
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      setShowResetForm(false)
                      setResetEmail("")
                      setError(null)
                    }}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "Enviando correo..." : "Enviar enlace"}
                  </Button>
                </div>
              </form>
            )
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  <button 
                    type="button"  // Changed to regular button
                    className="text-sm font-medium text-primary hover:underline p-0 h-auto" 
                    onClick={() => setShowResetForm(true)}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
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
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">Panel de administración exclusivo para personal autorizado</p>
        </CardFooter>
      </Card>
    </div>
  )
}