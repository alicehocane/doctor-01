import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import MainLayout from "@/components/main-layout"
import FeaturedSections from "@/components/featured-sections"
import SearchBar from "@/components/search-bar"

export const metadata: Metadata = {
  title: "Busca Doctor México | Encuentra médicos de confianza en México",
  description: "Encuentra médicos de confianza por ciudad, especialidad o padecimientos atendidos en México.",
}

export default function Home() {
  return (
    <MainLayout showSearch={true}>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
              Encuentra el médico adecuado para tu salud
            </h1>
            <p className="text-xl text-muted-foreground">
              Directorio completo de médicos en México, organizados por ciudad, especialidad y padecimientos atendidos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="#search-section">
                  <Search className="mr-2 h-5 w-5" />
                  Buscar Médicos
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">
                  Conocer Más
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Médicos profesionales"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search-section" className="py-12 scroll-mt-20">
        {/* <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Busca médicos por:</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encuentra el especialista que necesitas de manera rápida y sencilla
          </p>
        </div>

        <SearchBar className="mb-12" /> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="bg-primary/10 rounded-full p-3 inline-flex">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Por Ciudad</h3>
                <p className="text-muted-foreground">
                  Encuentra médicos cercanos a tu ubicación en cualquier ciudad de México.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="bg-primary/10 rounded-full p-3 inline-flex">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Por Especialidad</h3>
                <p className="text-muted-foreground">
                  Busca médicos por su especialidad médica, desde cardiología hasta pediatría.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="bg-primary/10 rounded-full p-3 inline-flex">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Por Padecimiento</h3>
                <p className="text-muted-foreground">
                  Encuentra especialistas que tratan tu condición o padecimiento específico.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Explora por categorías</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Navega por nuestras categorías más populares para encontrar el médico que necesitas
          </p>
        </div>

        <FeaturedSections />
      </section>
    </MainLayout>
  )
}
