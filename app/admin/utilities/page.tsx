"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function UtilitiesPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {/* <Button variant="ghost" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver
        </Button> */}

        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Utilidades</h1>
          <p className="text-muted-foreground">Herramientas administrativas para el mantenimiento del sistema.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Carga Masiva de Médicos</CardTitle>
            <CardDescription>Sube múltiples registros de médicos a la vez.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Esta utilidad te permite cargar múltiples médicos a la vez mediante un archivo JSON. Cada médico recibirá
              automáticamente un ID único y una fecha de creación.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/admin/utilities/bulk-upload">
                <Upload className="mr-2 h-4 w-4" />
                Ir a Carga Masiva
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
