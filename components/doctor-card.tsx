import Link from "next/link"
import { Phone, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DoctorCardProps {
  doctor: any
  searchType: string
  searchValue: string
}

export default function DoctorCard({ doctor, searchType, searchValue }: DoctorCardProps) {
  // Determine which specialty to show based on search
  let displaySpecialty = doctor.specialties[0]

  if (searchType === "especialidad") {
    const matchedSpecialty = doctor.specialties.find(
      (specialty: string) => specialty.toLowerCase() === searchValue.toLowerCase(),
    )
    if (matchedSpecialty) {
      displaySpecialty = matchedSpecialty
    }
  }

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    if (phone.length === 10) {
      return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6)}`
    }
    return phone
  }

  return (
    <div className="bg-card rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-3/4">
          <h3 className="text-lg font-semibold mb-1">
            <Link href={`/doctor/${doctor.id}`} className="hover:text-primary transition-colors">
              {doctor.fullName}
            </Link>
          </h3>

          <Badge variant="outline" className="mb-3">
            {displaySpecialty}
          </Badge>

          <div className="space-y-2 text-sm">
            {doctor.cities.length > 0 && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>{doctor.cities.join(", ")}</span>
              </div>
            )}

            {doctor.phoneNumbers.length > 0 && (
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>{formatPhoneNumber(doctor.phoneNumbers[0])}</span>
              </div>
            )}

            {doctor.diseasesTreated.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">Padecimientos atendidos:</p>
                <div className="flex flex-wrap gap-1">
                  {doctor.diseasesTreated.slice(0, 3).map((disease: string) => (
                    <Badge key={disease} variant="secondary" className="text-xs">
                      {disease}
                    </Badge>
                  ))}
                  {doctor.diseasesTreated.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{doctor.diseasesTreated.length - 3} más
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="md:w-1/4 flex flex-col justify-center items-center gap-2 mt-4 md:mt-0">
          <Button asChild className="w-full">
            <Link href={`/doctor/${doctor.id}`}>
              Ver perfil
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          {doctor.phoneNumbers.length > 0 && (
            <Button variant="outline" className="w-full" asChild>
              <a href={`tel:${doctor.phoneNumbers[0]}`}>
                <Phone className="mr-2 h-4 w-4" />
                Llamar
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}