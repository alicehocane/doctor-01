import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import MainLayout from "@/components/main-layout"

export const metadata: Metadata = {
  title: "Términos de Servicio | Busca Doctor México",
  description: "Términos y condiciones de uso del Busca Doctor México.",
}

export default function TermsOfServicePage() {
  return (
    <MainLayout showSearch={false}>
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">Términos de Servicio</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Introducción</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Última actualización: 7 de mayo de 2025</p>
            <p>
              Estos términos y condiciones describen las reglas y regulaciones para el uso del sitio web del Directorio
              de Médicos.
            </p>
            <p>
              Al acceder a este sitio web, asumimos que acepta estos términos y condiciones en su totalidad. No continúe
              usando el sitio web del Busca Doctor México si no acepta todos los términos y condiciones establecidos
              en esta página.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Licencia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              A menos que se indique lo contrario, el Busca Doctor México y/o sus licenciantes poseen los derechos de
              propiedad intelectual de todo el material en el Busca Doctor México. Todos los derechos de propiedad
              intelectual están reservados.
            </p>
            <p>
              Puede ver y/o imprimir páginas desde el sitio web para su uso personal, sujeto a las restricciones
              establecidas en estos términos y condiciones.
            </p>
            <p>No debe:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Republicar material del Busca Doctor México</li>
              <li>Vender, alquilar o sublicenciar material del Busca Doctor México</li>
              <li>Reproducir, duplicar o copiar material del Busca Doctor México</li>
              <li>Redistribuir contenido del Busca Doctor México</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Limitaciones de responsabilidad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              En ningún caso, el Busca Doctor México o sus proveedores serán responsables de ningún daño (incluidos,
              sin limitación, daños por pérdida de datos o beneficios, o debido a la interrupción del negocio) que
              surjan del uso o la incapacidad de usar los materiales en el sitio web del Busca Doctor México, incluso
              si el Busca Doctor México o un representante autorizado del Busca Doctor México ha sido notificado
              oralmente o por escrito de la posibilidad de tales daños.
            </p>
            <p>
              Debido a que algunas jurisdicciones no permiten limitaciones en garantías implícitas, o limitaciones de
              responsabilidad por daños consecuentes o incidentales, estas limitaciones pueden no aplicarse a usted.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Precisión de los materiales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Los materiales que aparecen en el sitio web del Busca Doctor México podrían incluir errores técnicos,
              tipográficos o fotográficos. El Busca Doctor México no garantiza que cualquiera de los materiales en su
              sitio web sean precisos, completos o actuales. El Busca Doctor México puede realizar cambios en los
              materiales contenidos en su sitio web en cualquier momento sin previo aviso.
            </p>
            <p>El Busca Doctor México no se compromete a actualizar los materiales.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enlaces</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              El Busca Doctor México no ha revisado todos los sitios vinculados a su sitio web y no es responsable del
              contenido de ningún sitio vinculado. La inclusión de cualquier enlace no implica respaldo por parte del
              Busca Doctor México del sitio. El uso de cualquier sitio web vinculado es bajo el propio riesgo del
              usuario.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Modificaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              El Busca Doctor México puede revisar estos términos de servicio para su sitio web en cualquier momento
              sin previo aviso. Al usar este sitio web, usted acepta estar sujeto a la versión actual de estos términos
              de servicio.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ley aplicable</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes de México y usted se somete
              irrevocablemente a la jurisdicción exclusiva de los tribunales en ese estado o ubicación.
            </p>
            <p>Si tiene alguna pregunta sobre estos términos, contáctenos en:</p>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Correo electrónico:</span>{" "}
                <a href="mailto:legal@directoriodemedicos.mx" className="text-primary hover:underline">
                  legal@directoriodemedicos.mx
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
