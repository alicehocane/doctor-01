import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import MainLayout from "@/components/main-layout"

export const metadata: Metadata = {
  title: "Acerca de | Directorio de Médicos",
  description: "Información sobre el Directorio de Médicos, nuestra misión y desarrollo.",
}

export default function AboutPage() {
  return (
    <MainLayout showSearch={false}>
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">Acerca del Directorio de Médicos</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nuestra Misión</CardTitle>
            <CardDescription>Conectando pacientes con médicos de confianza en México</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              El Directorio de Médicos nació con la misión de facilitar el acceso a la atención médica de calidad en
              México, conectando a pacientes con médicos especializados de manera rápida y eficiente.
            </p>
            <p>
              Entendemos que encontrar el médico adecuado para una condición específica puede ser un proceso complicado.
              Por eso, hemos desarrollado una plataforma que permite a los usuarios buscar médicos por ciudad,
              especialidad o padecimiento específico, simplificando el proceso de encontrar la atención médica adecuada.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nuestros Valores</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex flex-col">
                <span className="font-medium">Accesibilidad</span>
                <span className="text-muted-foreground">
                  Creemos que todos merecen acceso a información médica clara y precisa.
                </span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Confiabilidad</span>
                <span className="text-muted-foreground">
                  Verificamos la información de los médicos para garantizar datos precisos y actualizados.
                </span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Privacidad</span>
                <span className="text-muted-foreground">
                  Respetamos y protegemos la privacidad de nuestros usuarios y médicos registrados.
                </span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Innovación</span>
                <span className="text-muted-foreground">
                  Mejoramos constantemente nuestra plataforma para ofrecer la mejor experiencia posible.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Si tienes preguntas, sugerencias o necesitas ayuda, no dudes en contactarnos:</p>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Correo electrónico:</span>{" "}
                <a href="mailto:contacto@directoriodemedicos.mx" className="text-primary hover:underline">
                  contacto@directoriodemedicos.mx
                </a>
              </p>
              <p>
                <span className="font-medium">Teléfono:</span>{" "}
                <a href="tel:+525512345678" className="text-primary hover:underline">
                  (55) 1234-5678
                </a>
              </p>
            </div>
            <div className="pt-4">
              <Button asChild>
                <Link href="/contact">Formulario de Contacto</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
