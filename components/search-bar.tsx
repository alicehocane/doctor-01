// components/search-bar.tsx
"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { trackSearch } from "@/lib/search-tracker"

// A generic ComboboxItem type for TypeScript
interface ComboboxItem {
  value: string
  label: string
}

interface SearchBarProps {
  className?: string
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const router = useRouter()

  // 1) State for the “Buscar en” Combobox  
  const [cityQuery, setCityQuery] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<ComboboxItem | null>(null)

  // 2) State for “Buscar por” (type) and its Combobox  
  const [searchBy, setSearchBy] = useState<"especialidad" | "padecimiento">(
    "especialidad"
  )
  const [optionQuery, setOptionQuery] = useState<string>("")
  const [selectedOption, setSelectedOption] = useState<ComboboxItem | null>(
    null
  )

  // 3) “Is searching” spinner  
  const [isSearching, setIsSearching] = useState<boolean>(false)

  // ————————————————————————————————————————————————————————————————
  // HARD-CODED ARRAYS (could come from Firestore, props, etc.)
  // ————————————————————————————————————————————————————————————————
  const ciudades: ComboboxItem[] = [
    { value: "Ciudad de México", label: "Ciudad de México" },
    { value: "Monterrey", label: "Monterrey" },
    { value: "Guadalajara", label: "Guadalajara" },
  ]

  const allEspecialidades: ComboboxItem[] = [
    { value: "Psicología", label: "Psicología" },
    { value: "Odontología", label: "Odontología" },
    { value: "Ginecología y Obstetricia", label: "Ginecología y Obstetricia" },
    { value: "Pediatría", label: "Pediatría" },
    { value: "Medicina General", label: "Medicina General" },
    { value: "Medicina Interna", label: "Medicina Interna" },
    { value: "Ortopedia y Traumatología", label: "Ortopedia y Traumatología" },
    { value: "Oftalmología", label: "Oftalmología" },
    { value: "Psiquiatría", label: "Psiquiatría" },
    { value: "Dermatología", label: "Dermatología" },
    { value: "Nutrición y Dietética", label: "Nutrición y Dietética" },
    { value: "Anestesiología", label: "Anestesiología" },
    { value: "Patología Bucal", label: "Patología Bucal" },
  ]

  const allPadecimientos: ComboboxItem[] = [
    { value: "Ansiedad", label: "Ansiedad" },
    { value: "Depresión", label: "Depresión" },
    { value: "Duelo", label: "Duelo" },
    { value: "Estrés", label: "Estrés" },
    { value: "Codependencia", label: "Codependencia" },
    { value: "Estrés postraumático", label: "Estrés postraumático" },
    { value: "Trastorno de conducta", label: "Trastorno de conducta" },
    { value: "Depresión en adolescentes", label: "Depresión en adolescentes" },
    { value: "Hipertensión", label: "Hipertensión" },
  ]

  // ————————————————————————————————————————————————————————————————
  // FILTERED LISTS: useMemo so we only recalc when input changes
  // ————————————————————————————————————————————————————————————————
  const filteredCities = useMemo(() => {
    if (!cityQuery) return ciudades
    return ciudades.filter((c) =>
      c.label.toLowerCase().includes(cityQuery.toLowerCase())
    )
  }, [cityQuery])

  const filteredOptions = useMemo(() => {
    const baseList =
      searchBy === "especialidad" ? allEspecialidades : allPadecimientos
    if (!optionQuery) return baseList
    return baseList.filter((opt) =>
      opt.label.toLowerCase().includes(optionQuery.toLowerCase())
    )
  }, [searchBy, optionQuery])

  // ————————————————————————————————————————————————————————————————
  // CLICK OUTSIDE / BLUR LOGIC: close dropdowns when you click away
  // ————————————————————————————————————————————————————————————————
  const cityRef = useRef<HTMLDivElement>(null)
  const optionRef = useRef<HTMLDivElement>(null)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const [optionDropdownOpen, setOptionDropdownOpen] = useState(false)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        cityRef.current &&
        !cityRef.current.contains(e.target as Node)
      ) {
        setCityDropdownOpen(false)
      }
      if (
        optionRef.current &&
        !optionRef.current.contains(e.target as Node)
      ) {
        setOptionDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // ————————————————————————————————————————————————————————————————
  // RENDER
  // ————————————————————————————————————————————————————————————————
  return (
    <div className={`bg-card rounded-lg shadow-sm p-4 mx-auto w-full max-w-screen-xl ${className}`}>
      <div className="flex flex-col gap-3 items-stretch md:flex-row md:justify-center md:items-end">
        {/* ──────────────────────────────────────────────────────────────── */}
        {/*                     Combobox: "Buscar en"                      */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <div className="w-full md:w-1/3" ref={cityRef}>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            Buscar en
          </label>
          <div className="relative">
            <input
              id="city"
              type="text"
              value={selectedCity?.label || cityQuery}
              onChange={(e) => {
                setCityQuery(e.target.value)
                setSelectedCity(null)
                setSearchValue("")
                setOptionQuery("")
              }}
              onFocus={() => setCityDropdownOpen(true)}
              placeholder="Escribe para buscar ciudad"
              className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* Dropdown panel */}
            {cityDropdownOpen && (
              <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                {filteredCities.length > 0 ? (
                  filteredCities.map((c) => (
                    <li
                      key={c.value}
                      onClick={() => {
                        setSelectedCity(c)
                        setCityQuery(c.label)
                        setCityDropdownOpen(false)
                      }}
                      className="cursor-pointer px-3 py-1 text-sm hover:bg-gray-100"
                    >
                      {c.label}
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-1 text-sm text-gray-500">
                    No hay coincidencias
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/*                    Combobox: "Buscar por"                      */}
        {/* ──────────────────────────────────────────────────────────────── */}
        {selectedCity && (
          <div className="w-full md:w-1/3">
            <label htmlFor="search-by" className="block text-sm font-medium mb-1">
              Buscar por
            </label>
            <div className="relative">
              <select
                id="search-by"
                value={searchBy}
                onChange={(e) => {
                  const val = e.target.value as "especialidad" | "padecimiento"
                  setSearchBy(val)
                  setSearchValue("")
                  setOptionQuery("")
                }}
                className="w-full cursor-pointer rounded-md border border-gray-200 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                <option value="especialidad">Especialidad</option>
                <option value="padecimiento">Padecimiento</option>
              </select>
            </div>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────────────── */}
        {/*               Combobox: “Especialidad/Padecimiento”            */}
        {/* ──────────────────────────────────────────────────────────────── */}
        {selectedCity && (
          <div className="w-full md:w-1/3" ref={optionRef}>
            <label htmlFor="search-value" className="block text-sm font-medium mb-1">
              {searchBy === "especialidad" ? "Especialidad" : "Padecimiento"}
            </label>
            <div className="relative">
              <input
                id="search-value"
                type="text"
                value={selectedOption?.label || optionFilter}
                onChange={(e) => {
                  setOptionQuery(e.target.value)
                  setSelectedOption(null)
                }}
                onFocus={() => setOptionDropdownOpen(true)}
                placeholder={`Escribe para buscar ${searchBy}`}
                className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {optionDropdownOpen && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt) => (
                      <li
                        key={opt.value}
                        onClick={() => {
                          setSelectedOption(opt)
                          setOptionQuery(opt.label)
                          setOptionDropdownOpen(false)
                        }}
                        className="cursor-pointer px-3 py-1 text-sm hover:bg-gray-100"
                      >
                        {opt.label}
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-1 text-sm text-gray-500">
                      No hay coincidencias
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────────────── */}
        {/*                        Botón "Buscar"                          */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <Button
          onClick={async () => {
            if (!selectedCity || !selectedOption) return
            setIsSearching(true)
            try {
              await trackSearch(searchBy, selectedOption.value)
              router.push(
                `/buscar?ciudad=${encodeURIComponent(
                  selectedCity.value
                )}&tipo=${searchBy}&valor=${encodeURIComponent(
                  selectedOption.value
                )}`
              )
            } catch (error) {
              console.error("Error tracking search:", error)
            } finally {
              setIsSearching(false)
            }
          }}
          className="w-full md:w-auto"
          disabled={!selectedCity || !selectedOption || isSearching}
        >
          <Search className="h-4 w-4 mr-2" />
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
      </div>
    </div>
  )
}
