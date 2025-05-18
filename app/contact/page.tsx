import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import ContactForm from "@/components/contact-form"
import MainLayout from "@/components/main-layout"

export const metadata: Metadata = {
  title: "Contacto | Directorio de Médicos",
  description: "Contáctanos para obtener más información sobre el Directorio de Médicos.",
}

export default function ContactPage() {
  return (
    <MainLayout showSearch={false}>
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">Contacto</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Envíanos un mensaje</CardTitle>
            <CardDescription>
              Completa el formulario y nos pondremos en contacto contigo lo antes posible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium">Correo Electrónico</h3>
                <p className="text-muted-foreground">
                  <a href="mailto:contacto@directoriodemedicos.mx" className="text-primary hover:underline">
                    contacto@directoriodemedicos.mx
                  </a>
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Teléfono</h3>
                <p className="text-muted-foreground">
                  <a href="tel:+525512345678" className="text-primary hover:underline">
                    (55) 1234-5678
                  </a>
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Horario de Atención</h3>
                <p className="text-muted-foreground">
                  Lunes a Viernes: 9:00 AM - 6:00 PM
                  <br />
                  Sábado: 9:00 AM - 2:00 PM
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Dirección</h3>
                <p className="text-muted-foreground">
                  Av. Insurgentes Sur 1234
                  <br />
                  Col. Del Valle, CP 03100
                  <br />
                  Ciudad de México, México
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
