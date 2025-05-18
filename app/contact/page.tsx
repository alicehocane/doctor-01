import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
            <CardTitle>Preguntas Frecuentes</CardTitle>
            <CardDescription>
              Encuentra respuestas a las preguntas más comunes sobre nuestro directorio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>¿Cómo puedo buscar un médico en el directorio?</AccordionTrigger>
                <AccordionContent>
                  Puedes buscar por ciudad, especialidad o padecimiento atendido usando los menús desplegables en la parte superior. Luego, haz clic en “Buscar” para ver los resultados.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>¿Por qué no veo resultados al cargar la página?</AccordionTrigger>
                <AccordionContent>
                  Para mantener la experiencia limpia y rápida, no mostramos resultados automáticamente. Primero debes realizar una búsqueda con los filtros disponibles.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>¿Qué información muestra cada perfil de médico?</AccordionTrigger>
                <AccordionContent>
                  Cada perfil incluye nombre, número de cédula, especialidades, padecimientos tratados, teléfonos, direcciones y ciudades donde consulta.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>¿Qué significan los botones “Ver más” en los perfiles?</AccordionTrigger>
                <AccordionContent>
                  Los botones “Ver más” expanden secciones como especialidades, teléfonos y padecimientos para mostrar información adicional sin saturar la vista principal.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>¿Qué hago si no encuentro al médico o especialidad que busco?</AccordionTrigger>
                <AccordionContent>
                  Puedes intentar buscar con diferentes filtros o revisar la sección de “Especialidades”, “Ciudades” o “Padecimientos Atendidos” destacados en la página de inicio.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>¿Cómo reporto un problema con el sitio web?</AccordionTrigger>
                <AccordionContent>
                  Si encuentras algún problema técnico con el sitio web, puedes enviarnos un correo electrónico a
                  <a href="mailto:soporte@directoriodemedicos.mx" className="text-primary hover:underline ml-1">
                    soporte@directoriodemedicos.mx 
                  </a>
                   , o llamar a nuestro equipo de soporte al número que aparece en la sección de información de contacto.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
