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
import { auth } from "@/lib/firebase" // Create this file

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showResetForm, setShowResetForm] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await setPersistence(auth, browserLocalPersistence)
      await signInWithEmailAndPassword(auth, email, password)

      // Set a session cookie (for middleware)
      document.cookie = `session=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict;`

      // Redirect to admin dashboard
      router.push("/admin")
    } catch (error: any) {
      console.error("Login error:", error)
      if (error.code === "auth/invalid-credential") {
        setError("Invalid credentials. Please check your email and password.")
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.")
      } else {
        setError(`Login error: ${error.message || error.code || "Unknown error"}`)
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
      setResetSent(true)
    } catch (error: any) {
      console.error("Password reset error:", error)
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email address.")
      } else {
        setError(`Password reset error: ${error.message || error.code || "Unknown error"}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 gap-4">
      <Card className="w-full max-w-md">
        {showResetForm ? (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
              <CardDescription>
                Enter your email to receive a password reset link
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {resetSent ? (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Password reset email sent to {resetEmail}. Please check your inbox.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="admin@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                variant="link" 
                onClick={() => {
                  setShowResetForm(false)
                  setResetSent(false)
                  setResetEmail("")
                }}
              >
                Back to login
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Login</CardTitle>
              <CardDescription>Enter your credentials to access the admin panel</CardDescription>
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto" 
                      type="button"
                      onClick={() => setShowResetForm(true)}
                    >
                      Forgot password?
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
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">Admin panel - authorized personnel only</p>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}