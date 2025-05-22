import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import MainLayout from "@/components/main-layout"

export const metadata: Metadata = {
  title: "Política de Privacidad | Busca Doctor México",
  description:
    "Política de privacidad del Busca Doctor México, cumpliendo con las leyes de protección de datos de México.",
}

export default function PrivacyPolicyPage() {
  return (
    <MainLayout showSearch={false}>
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">Política de Privacidad</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Introducción</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Última actualización: 22 de mayo de 2025</p>
            <p>
              En Busca Doctor México, respetamos su privacidad y nos comprometemos a proteger sus datos personales.
              Esta política de privacidad le informará sobre cómo cuidamos sus datos personales cuando visita nuestro
              sitio web y le informará sobre sus derechos de privacidad y cómo la ley lo protege.
            </p>
            <p>
              Esta política de privacidad se aplica a la información que recopilamos cuando utiliza nuestro sitio web,
              independientemente de cómo acceda a él.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Información que recopilamos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Podemos recopilar, usar, almacenar y transferir diferentes tipos de datos personales sobre usted, que
              hemos agrupado de la siguiente manera:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Datos de identidad:</span> incluye nombre, apellido, título.
              </li>
              <li>
                <span className="font-medium">Datos de contacto:</span> incluye dirección de correo electrónico y
                números de teléfono.
              </li>
              <li>
                <span className="font-medium">Datos técnicos:</span> incluye dirección de protocolo de Internet (IP),
                datos de inicio de sesión, tipo y versión del navegador, configuración de zona horaria y ubicación,
                tipos y versiones de complementos del navegador, sistema operativo y plataforma, y otra tecnología en
                los dispositivos que utiliza para acceder a este sitio web.
              </li>
              <li>
                <span className="font-medium">Datos de uso:</span> incluye información sobre cómo utiliza nuestro sitio
                web y servicios.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cómo utilizamos su información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Solo utilizaremos sus datos personales cuando la ley nos lo permita. Más comúnmente, utilizaremos sus
              datos personales en las siguientes circunstancias:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Cuando necesitemos ejecutar el contrato que estamos a punto de celebrar o hemos celebrado con usted.
              </li>
              <li>
                Cuando sea necesario para nuestros intereses legítimos (o los de un tercero) y sus intereses y derechos
                fundamentales no anulen esos intereses.
              </li>
              <li>Cuando necesitemos cumplir con una obligación legal o regulatoria.</li>
            </ul>
            <p>
              En general, no confiamos en el consentimiento como base legal para procesar sus datos personales, excepto
              en relación con el envío de comunicaciones de marketing directo de terceros a través de correo electrónico
              o mensaje de texto.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Divulgación de sus datos personales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Podemos compartir sus datos personales con las partes que se indican a continuación para los fines
              establecidos en esta política de privacidad:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proveedores de servicios que proporcionan servicios de TI y administración de sistemas.</li>
              <li>Asesores profesionales, incluidos abogados, banqueros, auditores y aseguradoras.</li>
              <li>Autoridades fiscales, reguladoras y otras autoridades.</li>
              <li>
                Terceros a quienes podemos optar por vender, transferir o fusionar partes de nuestro negocio o nuestros
                activos.
              </li>
            </ul>
            <p>
              Requerimos que todos los terceros respeten la seguridad de sus datos personales y los traten de acuerdo
              con la ley. No permitimos que nuestros proveedores de servicios externos utilicen sus datos personales
              para sus propios fines y solo les permitimos procesar sus datos personales para fines específicos y de
              acuerdo con nuestras instrucciones.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sus derechos legales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Bajo ciertas circunstancias, tiene derechos bajo las leyes de protección de datos en relación con sus
              datos personales, incluyendo el derecho a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Solicitar acceso a sus datos personales.</li>
              <li>Solicitar la corrección de sus datos personales.</li>
              <li>Solicitar la eliminación de sus datos personales.</li>
              <li>Oponerse al procesamiento de sus datos personales.</li>
              <li>Solicitar la restricción del procesamiento de sus datos personales.</li>
              <li>Solicitar la transferencia de sus datos personales.</li>
              <li>Retirar el consentimiento.</li>
            </ul>
            <p>
              Si desea ejercer cualquiera de los derechos establecidos anteriormente, contáctenos a través de nuestro
              formulario de contacto o por correo electrónico a contacto@directoriodemedicos.mx.
            </p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Si tiene alguna pregunta sobre esta política de privacidad o nuestras prácticas de privacidad, contáctenos
              en:
            </p>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Correo electrónico:</span>{" "}
                <a href="mailto:privacidad@directoriodemedicos.mx" className="text-primary hover:underline">
                  privacidad@directoriodemedicos.mx
                </a>
              </p>
              <p>
                <span className="font-medium">Dirección:</span> Av. Insurgentes Sur 1234, Col. Del Valle, CP 03100,
                Ciudad de México, México
              </p>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </MainLayout>
  )
}
