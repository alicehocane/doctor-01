// components/search-bar.tsx
"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { trackSearch } from "@/lib/search-tracker"

interface SearchBarProps {
  className?: string
}

interface ComboboxItem {
  value: string
  label: string
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const router = useRouter()

  // ---------------------- State ----------------------
  // 1) City combobox
  const [cityQuery, setCityQuery] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<ComboboxItem | null>(null)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)

  // 2) Search-by (Especialidad | Padecimiento)
  const [searchBy, setSearchBy] = useState<"especialidad" | "padecimiento">(
    "especialidad"
  )

  // 3) Option combobox (Especialidad or Padecimiento)
  const [optionQuery, setOptionQuery] = useState<string>("")
  const [selectedOption, setSelectedOption] = useState<ComboboxItem | null>(
    null
  )
  const [optionDropdownOpen, setOptionDropdownOpen] = useState(false)

  // 4) Final search button loading
  const [isSearching, setIsSearching] = useState(false)

  // ---------------------- Hardcoded Data ----------------------
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

  // ---------------------- Filter Logic ----------------------
  // Filter cities as soon as user types; dropdown appears only when query is non-empty
  const filteredCities = useMemo(() => {
    if (!cityQuery) return []
    return ciudades.filter((c) =>
      c.label.toLowerCase().includes(cityQuery.toLowerCase())
    )
  }, [cityQuery])

  // Filter options (especialidades or padecimientos) based on optionQuery
  const filteredOptions = useMemo(() => {
    if (!optionQuery) return []
    const list =
      searchBy === "especialidad"
        ? allEspecialidades
        : allPadecimientos
    return list.filter((opt) =>
      opt.label.toLowerCase().includes(optionQuery.toLowerCase())
    )
  }, [searchBy, optionQuery])

  // ---------------------- Click Outside Handling ----------------------
  const cityRef = useRef<HTMLDivElement>(null)
  const optionRef = useRef<HTMLDivElement>(null)

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // ---------------------- Refs for auto-focus ----------------------
  const cityInputRef = useRef<HTMLInputElement>(null)
  const optionInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (cityDropdownOpen) {
      setTimeout(() => cityInputRef.current?.focus(), 0)
    }
  }, [cityDropdownOpen])

  useEffect(() => {
    if (optionDropdownOpen) {
      setTimeout(() => optionInputRef.current?.focus(), 0)
    }
  }, [optionDropdownOpen])

  // ---------------------- Search Handler ----------------------
  const handleSearch = async () => {
    if (selectedCity && selectedOption) {
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
    }
  }

  // ---------------------- Render ----------------------
  return (
    <div
      className={`bg-card rounded-lg shadow-sm p-4 mx-auto w-full max-w-screen-xl ${className}`}
    >
      <div className="flex flex-col gap-3 items-stretch md:flex-row md:justify-center md:items-end">
        {/* ──────────────────────────────────────────────────────────────── */}
        {/*                          Ciudad Combobox                        */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <div className="w-full md:w-1/3" ref={cityRef}>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            Buscar en
          </label>
          <div className="relative">
            {/* Input styled to match the dropdown trigger exactly */}
            <input
              id="city"
              type="text"
              placeholder="Escribe para buscar ciudad"
              value={selectedCity?.label ?? cityQuery}
              onChange={(e) => {
                setCityQuery(e.target.value)
                setSelectedCity(null)
                setOptionQuery("")
                setSelectedOption(null)
                setOptionDropdownOpen(false)
                setCityDropdownOpen(true)
              }}
              onFocus={() => {
                setCityDropdownOpen(true)
                setOptionDropdownOpen(false)
              }}
              className="
                w-full 
                h-10 
                rounded-md 
                border 
                border-gray-200 
                bg-white 
                px-3 
                py-1 
                text-sm 
                focus:outline-none 
                focus:ring-2 
                focus:ring-primary
              "
            />

            {/* Only show dropdown when user has at least one character */}
            {cityDropdownOpen && cityQuery.length > 0 && (
              <ul className="
                absolute 
                z-10 
                mt-1 
                max-h-60 
                w-full 
                overflow-auto 
                rounded-md 
                bg-white 
                shadow-lg 
                ring-1 
                ring-black 
                ring-opacity-5
              ">
                {filteredCities.length > 0 ? (
                  filteredCities.map((c) => (
                    <li
                      key={c.value}
                      onClick={() => {
                        setSelectedCity(c)
                        setCityQuery(c.label)
                        setCityDropdownOpen(false)
                        // Reset downstream option
                        setSelectedOption(null)
                        setOptionQuery("")
                      }}
                      className="
                        cursor-pointer 
                        px-3 
                        py-1 
                        text-sm 
                        hover:bg-gray-100
                      "
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
        {/*                         Buscar por Selector                     */}
        {/* ──────────────────────────────────────────────────────────────── */}
        {selectedCity && (
          <div className="w-full md:w-1/3">
            <label
              htmlFor="search-by"
              className="block text-sm font-medium mb-1"
            >
              Buscar por
            </label>
            <Select
              value={searchBy}
              onValueChange={(val) => {
                setSearchBy(val)
                setSelectedOption(null)
                setOptionQuery("")
              }}
            >
              <SelectTrigger id="search-by" className="w-full h-10">
                <SelectValue placeholder="Selecciona tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="especialidad">Especialidad</SelectItem>
                <SelectItem value="padecimiento">Padecimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────────────── */}
        {/*                  Especialidad/Padecimiento Combobox             */}
        {/* ──────────────────────────────────────────────────────────────── */}
        {selectedCity && (
          <div className="w-full md:w-1/3" ref={optionRef}>
            <label
              htmlFor="search-value"
              className="block text-sm font-medium mb-1"
            >
              {searchBy === "especialidad" ? "Especialidad" : "Padecimiento"}
            </label>
            <div className="relative">
              <input
                id="search-value"
                type="text"
                placeholder={`Escribe para buscar ${searchBy}`}
                value={selectedOption?.label ?? optionQuery}
                onChange={(e) => {
                  setOptionQuery(e.target.value)
                  setSelectedOption(null)
                  setOptionDropdownOpen(true)
                }}
                onFocus={() => {
                  setOptionDropdownOpen(true)
                  setCityDropdownOpen(false)
                }}
                className="
                  w-full 
                  h-10 
                  rounded-md 
                  border 
                  border-gray-200 
                  bg-white 
                  px-3 
                  py-1 
                  text-sm 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-primary
                "
              />

              {/* Only open suggestions when user has typed ≥1 character */}
              {optionDropdownOpen && optionQuery.length > 0 && (
                <ul className="
                  absolute 
                  z-10 
                  mt-1 
                  max-h-60 
                  w-full 
                  overflow-auto 
                  rounded-md 
                  bg-white 
                  shadow-lg 
                  ring-1 
                  ring-black 
                  ring-opacity-5
                ">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt) => (
                      <li
                        key={opt.value}
                        onClick={() => {
                          setSelectedOption(opt)
                          setOptionQuery(opt.label)
                          setOptionDropdownOpen(false)
                        }}
                        className="
                          cursor-pointer 
                          px-3 
                          py-1 
                          text-sm 
                          hover:bg-gray-100
                        "
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
        {/*                         Botón “Buscar”                           */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <Button
          onClick={handleSearch}
          className="w-full md:w-auto h-10"
          disabled={!selectedCity || !selectedOption || isSearching}
        >
          <Search className="h-4 w-4 mr-2" />
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
      </div>
    </div>
  )
}
