"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function UnauthorizedPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 gap-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Acceso No Autorizado</CardTitle>
          <CardDescription className="text-center">
            No tienes permisos de administrador para acceder a esta área.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            Esta sección está restringida a usuarios con privilegios de administrador. Si crees que deberías tener
            acceso, por favor contacta al administrador del sistema.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleSignOut}>Volver al inicio de sesión</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
