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
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth"
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [envStatus, setEnvStatus] = useState<Record<string, boolean>>({
    apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Initialize Firebase directly
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

      // Set persistence to LOCAL to persist the user session
      await setPersistence(auth, browserLocalPersistence)

      // Sign in
      await signInWithEmailAndPassword(auth, email, password)

      // Set a session cookie (for middleware)
      document.cookie = `session=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict;`

      // Redirect to admin dashboard
      router.push("/admin")
    } catch (error: any) {
      console.error("Login error:", error)

      // Handle different Firebase auth errors
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 gap-4">
      <Card className="w-full max-w-md">
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
          <p className="text-sm text-muted-foreground">Panel de administración exclusivo para personal autorizado</p>
        </CardFooter>
      </Card>

      {/* <div className="w-full max-w-md mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
        <h3 className="font-medium mb-2">Firebase Environment Variables Status:</h3>
        <ul className="text-sm space-y-1">
          <li>API Key: {envStatus.apiKey ? "✅ Set" : "❌ Not Set"}</li>
          <li>Auth Domain: {envStatus.authDomain ? "✅ Set" : "❌ Not Set"}</li>
          <li>Project ID: {envStatus.projectId ? "✅ Set" : "❌ Not Set"}</li>
          <li>Storage Bucket: {envStatus.storageBucket ? "✅ Set" : "❌ Not Set"}</li>
          <li>Messaging Sender ID: {envStatus.messagingSenderId ? "✅ Set" : "❌ Not Set"}</li>
          <li>App ID: {envStatus.appId ? "✅ Set" : "❌ Not Set"}</li>
        </ul>
      </div> */}
    </div>
  )
}
