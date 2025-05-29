import type { Metadata } from "next"
import { Suspense } from "react"
import SearchResults from "@/components/search-results"
import SearchResultsSkeleton from "@/components/search-results-skeleton"
import MainLayout from "@/components/main-layout"

export const metadata: Metadata = {
  title: "Buscar Médicos | Busca Doctor México",
  description: "Resultados de búsqueda de médicos por ciudad, especialidad o padecimientos atendidos.",
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { 
    ciudad?: string
    tipo?: string
    valor?: string
  }
}) {
  const ciudad = typeof searchParams.ciudad === "string" ? searchParams.ciudad : ""
  const tipo = typeof searchParams.tipo === "string" ? searchParams.tipo : ""
  const valor = typeof searchParams.valor === "string" ? searchParams.valor : ""

  return (
    <MainLayout>
      {ciudad && tipo && valor ? (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              Resultados en {ciudad}
            </h1>
            <p className="text-muted-foreground">
              {tipo === "especialidad" 
                ? `Especialidad: ${valor}`
                : `Padecimiento: ${valor}`}
            </p>
          </div>

          <Suspense fallback={<SearchResultsSkeleton />}>
            <SearchResults ciudad={ciudad} tipo={tipo} valor={valor} />
          </Suspense>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Por favor completa todos los campos de búsqueda para ver resultados.
          </p>
        </div>
      )}
    </MainLayout>
  )
}