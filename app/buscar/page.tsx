import type { Metadata } from "next"
import { Suspense } from "react"
import SearchResults from "@/components/search-results"
import SearchResultsSkeleton from "@/components/search-results-skeleton"
import MainLayout from "@/components/main-layout"

export const metadata: Metadata = {
  title: "Buscar Médicos | Directorio de Médicos",
  description: "Resultados de búsqueda de médicos por ciudad, especialidad o padecimientos atendidos.",
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const tipo = typeof searchParams.tipo === "string" ? searchParams.tipo : ""
  const valor = typeof searchParams.valor === "string" ? searchParams.valor : ""

  return (
    <MainLayout>
      {tipo && valor ? (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Resultados para{" "}
            {tipo === "ciudad" ? "Ciudad" : tipo === "especialidad" ? "Especialidad" : "Padecimiento Atendido"}:{" "}
            <span className="text-primary">{valor}</span>
          </h2>

          <Suspense fallback={<SearchResultsSkeleton />}>
            <SearchResults tipo={tipo} valor={valor} />
          </Suspense>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Por favor, selecciona los criterios de búsqueda para ver resultados.</p>
        </div>
      )}
    </MainLayout>
  )
}
