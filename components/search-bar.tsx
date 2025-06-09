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
  synonyms?: string[]
}

// Utility: strip accents/diacritics and lowercase
const normalize = (str: string) =>
  str
    .normalize("NFD")                    // decompose combined letters
    .replace(/[\u0300-\u036f]/g, "")     // remove diacritic marks
    .toLowerCase()

export default function SearchBar({ className = "" }: SearchBarProps) {
  const router = useRouter()

  // ---------------------- State ----------------------
  const [cityQuery, setCityQuery] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<ComboboxItem | null>(null)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)

  const [searchBy, setSearchBy] = useState<"especialidad" | "padecimiento">(
    "especialidad"
  )

  const [optionQuery, setOptionQuery] = useState<string>("")
  const [selectedOption, setSelectedOption] = useState<ComboboxItem | null>(null)
  const [optionDropdownOpen, setOptionDropdownOpen] = useState(false)

  const [isSearching, setIsSearching] = useState(false)

  // ---------------------- Hardcoded Data ----------------------
  const ciudades: ComboboxItem[] = [
    {
      value: "Ciudad de México",
      label: "Ciudad de México",
      synonyms: ["Mexico", "Ciudad de Mexico", "Distrito Federal", "DF"],
    },
    { value: "Monterrey",   label: "Monterrey" },
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
  { value: "Otorrinolaringología", label: "Otorrinolaringología" },
  { value: "Neonatología", label: "Neonatología" },
  { value: "Urología", label: "Urología" },
  { value: "Medicina Estética y Reconstructiva", label: "Medicina Estética y Reconstructiva" },
  { value: "Laboratorio Clínico", label: "Laboratorio Clínico" },
  { value: "Gastroenterología", label: "Gastroenterología" },
  { value: "Cirugía General", label: "Cirugía General" },
  { value: "Neurocirugía", label: "Neurocirugía" },
  { value: "Neumología", label: "Neumología" },
  { value: "Medicina Familiar", label: "Medicina Familiar" },
  { value: "Geriatría", label: "Geriatría" },
  { value: "Alergología", label: "Alergología" },
  { value: "Radiología y Diagnóstico por Imagen", label: "Radiología y Diagnóstico por Imagen" },
  { value: "Cirugía Pediátrica", label: "Cirugía Pediátrica" },
  { value: "Reumatología", label: "Reumatología" },
  { value: "Nefrología", label: "Nefrología" },
  { value: "Oncología Médica", label: "Oncología Médica" },
  { value: "Fisioterapia", label: "Fisioterapia" },
  { value: "Hematología", label: "Hematología" },
  { value: "Medicina Integrativa y Complementaria", label: "Medicina Integrativa y Complementaria" },
  { value: "Endocrinología, Diabetes y Metabolismo", label: "Endocrinología, Diabetes y Metabolismo" },
  { value: "Cardiología", label: "Cardiología" },
  { value: "Medicina de Urgencias y Cuidados Intensivos", label: "Medicina de Urgencias y Cuidados Intensivos" },
  { value: "Rehabilitación y Medicina Física", label: "Rehabilitación y Medicina Física" },
  { value: "Infectología", label: "Infectología" },
  { value: "Medicina del Deporte", label: "Medicina del Deporte" },
  { value: "Angiología", label: "Angiología" },
  { value: "Homeopatía", label: "Homeopatía" },
  { value: "Neurología Pediátrica", label: "Neurología Pediátrica" },
  { value: "Endoscopia", label: "Endoscopia" },
  { value: "Cirugía Maxilofacial", label: "Cirugía Maxilofacial" },
  { value: "Cirugía Vascular y Angiología", label: "Cirugía Vascular y Angiología" },
  { value: "Patología (Anatómica y Clínica)", label: "Patología (Anatómica y Clínica)" },
  { value: "Proctología", label: "Proctología" },
  { value: "Inmunología", label: "Inmunología" },
  { value: "Odontología Pediátrica", label: "Odontología Pediátrica" },
  { value: "Cardiología Pediátrica", label: "Cardiología Pediátrica" },
  { value: "Cirugía Bariátrica", label: "Cirugía Bariátrica" },
  { value: "Radiooncología", label: "Radiooncología" },
  { value: "Acupuntura", label: "Acupuntura" },
  { value: "Audiología", label: "Audiología" },
  { value: "Endocrinología Pediátrica", label: "Endocrinología Pediátrica" },
  { value: "Neumología Pediátrica", label: "Neumología Pediátrica" },
  { value: "Podología y Podiatría", label: "Podología y Podiatría" },
  { value: "otoneurología y foniatría", label: "otoneurología y foniatría" },
  { value: "Medicina del Dolor y Algología", label: "Medicina del Dolor y Algología" },
  { value: "Gastroenterología Pediátrica", label: "Gastroenterología Pediátrica" },
  { value: "Sexología", label: "Sexología" },
  { value: "Salud Pública y Medicina Preventiva", label: "Salud Pública y Medicina Preventiva" },
  { value: "Naturopatía", label: "Naturopatía" },
  { value: "Cirugía Cardiotorácica", label: "Cirugía Cardiotorácica" },
  { value: "Psicopedagogía", label: "Psicopedagogía" },
  { value: "Enfermería", label: "Enfermería" },
  { value: "Reumatología Pediátrica", label: "Reumatología Pediátrica" },
  { value: "Cirugía oncológica", label: "Cirugía oncológica" },
  { value: "Retina Médica y Quirúrgica", label: "Retina Médica y Quirúrgica" },
  { value: "Ginecología Oncológica", label: "Ginecología Oncológica" },
  { value: "Hematología Pediátrica", label: "Hematología Pediátrica" },
  { value: "Nefrología Pediátrica", label: "Nefrología Pediátrica" },
  { value: "Psiquiatría Infantil", label: "Psiquiatría Infantil" },
  { value: "Quiropráctica", label: "Quiropráctica" },
  { value: "Genética", label: "Genética" },
  { value: "Optometría", label: "Optometría" },
  { value: "Dermatología Pediátrica", label: "Dermatología Pediátrica" },
  { value: "Oncología Pediátrica", label: "Oncología Pediátrica" },
  { value: "Ortopedia Pediátrica", label: "Ortopedia Pediátrica" },
  { value: "Medicina del Enfermo Pediátrico en Estado Crítico", label: "Medicina del Enfermo Pediátrico en Estado Crítico" },
  { value: "Neurofisiología", label: "Neurofisiología" },
  { value: "Oftalmología Pediátrica", label: "Oftalmología Pediátrica" },
  { value: "Infectología Pediátrica", label: "Infectología Pediátrica" },
  { value: "Otorrinolaringología pediátrica", label: "Otorrinolaringología pediátrica" },
  { value: "Terapia ocupacional", label: "Terapia ocupacional" },
  { value: "Ortodoncia", label: "Ortodoncia" },
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
  { value: "Trastorno obsesivo compulsivo (TOC)", label: "Trastorno obsesivo compulsivo (TOC)" },
  { value: "Ataques de pánico", label: "Ataques de pánico" },
  { value: "Obesidad", label: "Obesidad" },
  { value: "Diabetes", label: "Diabetes" },
  { value: "Bullying (acoso escolar)", label: "Bullying (acoso escolar)" },
  { value: "Dislipidemia", label: "Dislipidemia" },
  { value: "Caries", label: "Caries" },
  { value: "Estrés laboral", label: "Estrés laboral" },
  { value: "Dolor de muelas", label: "Dolor de muelas" },
  { value: "Trastorno de ansiedad", label: "Trastorno de ansiedad" },
  { value: "Fracturas de dientes", label: "Fracturas de dientes" },
  { value: "Síndrome metabólico", label: "Síndrome metabólico" },
  { value: "Infección dental", label: "Infección dental" },
  { value: "Bruxismo", label: "Bruxismo" },
  { value: "Trastorno de ansiedad generalizada", label: "Trastorno de ansiedad generalizada" },
  { value: "Virus del papiloma humano (VPH)", label: "Virus del papiloma humano (VPH)" },
  { value: "Embarazo", label: "Embarazo" },
  { value: "Diabetes gestacional", label: "Diabetes gestacional" },
  { value: "Miomas uterinos", label: "Miomas uterinos" },
  { value: "Trastornos de la personalidad", label: "Trastornos de la personalidad" },
  { value: "Angustia", label: "Angustia" },
  { value: "Pérdida de dientes", label: "Pérdida de dientes" },
  { value: "Desgaste dental", label: "Desgaste dental" },
  { value: "Comportamiento suicida", label: "Comportamiento suicida" },
  { value: "Menopausia", label: "Menopausia" },
  { value: "Amenaza de aborto", label: "Amenaza de aborto" },
  { value: "Sobrepeso", label: "Sobrepeso" },
  { value: "Dientes desalineados", label: "Dientes desalineados" },
  { value: "Dientes apiñados", label: "Dientes apiñados" },
  { value: "Hernia de disco", label: "Hernia de disco" },
  { value: "Lesiones deportivas", label: "Lesiones deportivas" },
  { value: "Trastorno de hiperactividad y déficit de atención (TDAH)", label: "Trastorno de hiperactividad y déficit de atención (TDAH)" },
  { value: "Enfermedad periodontal - piorrea", label: "Enfermedad periodontal - piorrea" },
  { value: "Osteoporosis", label: "Osteoporosis" },
  { value: "Síndrome de pinzamiento del hombro", label: "Síndrome de pinzamiento del hombro" },
  { value: "Insuficiencia cardíaca", label: "Insuficiencia cardíaca" },
  { value: "Conducta agresiva", label: "Conducta agresiva" },
  { value: "Embarazo de alto riesgo", label: "Embarazo de alto riesgo" },
  { value: "Endometriosis", label: "Endometriosis" },
  { value: "Lesiones de Menisco", label: "Lesiones de Menisco" },
  { value: "Depresión crónica", label: "Depresión crónica" },
  { value: "Fobia específica o simple", label: "Fobia específica o simple" },
  { value: "Sangrado uterino disfuncional", label: "Sangrado uterino disfuncional" },
  { value: "Adicciones", label: "Adicciones" },
  { value: "Maltrato psicológico y abandono infantil", label: "Maltrato psicológico y abandono infantil" },
  { value: "Desorden de ansiedad por separación", label: "Desorden de ansiedad por separación" },
  { value: "Neumonía", label: "Neumonía" },
  { value: "Desnutrición", label: "Desnutrición" },
  { value: "Lesión de Manguito Rotador", label: "Lesión de Manguito Rotador" },
  { value: "Faringitis", label: "Faringitis" },
  { value: "Depresión neurótica (distimia)", label: "Depresión neurótica (distimia)" },
  { value: "Lesión de Ligamentarias de Rodilla", label: "Lesión de Ligamentarias de Rodilla" },
  { value: "Enfermedad articular degenerativa", label: "Enfermedad articular degenerativa" },
  { value: "Infertilidad", label: "Infertilidad" },
  { value: "Apendicitis", label: "Apendicitis" },
  { value: "Gingivitis", label: "Gingivitis" },
  { value: "Lesiones de cartílago articular", label: "Lesiones de cartílago articular" },
  { value: "Ciática", label: "Ciática" },
  { value: "Dermatitis atópica", label: "Dermatitis atópica" },
  { value: "Hernia inguinal", label: "Hernia inguinal" },
  { value: "Colon irritable", label: "Colon irritable" },
  { value: "Lumbalgia", label: "Lumbalgia" },
  { value: "Cataratas", label: "Cataratas" },
  { value: "Manchas en dientes", label: "Manchas en dientes" },
  { value: "Enfermedad de transmisión sexual (ETS)", label: "Enfermedad de transmisión sexual (ETS)" },
  { value: "Mordida abierta", label: "Mordida abierta" },
  { value: "Rinitis alérgica", label: "Rinitis alérgica" },
  { value: "Osteoartrosis", label: "Osteoartrosis" },
  { value: "Asma", label: "Asma" },
  { value: "Asma pediátrico", label: "Asma pediátrico" },
  { value: "Colecistitis aguda", label: "Colecistitis aguda" },
  { value: "Diabetes tipo 2", label: "Diabetes tipo 2" },
  { value: "Diverticulitis", label: "Diverticulitis" },
  { value: "Diente retenido", label: "Diente retenido" },
  { value: "Hernia umbilical", label: "Hernia umbilical" },
  { value: "Sensibilidad dentaria", label: "Sensibilidad dentaria" },
  { value: "Baja autoestima", label: "Baja autoestima" },
  { value: "Cardiomiopatía isquémica", label: "Cardiomiopatía isquémica" },
  { value: "Anorexia nerviosa", label: "Anorexia nerviosa" },
  { value: "Fascitis plantar", label: "Fascitis plantar" },
  { value: "Depresión grave", label: "Depresión grave" },
  { value: "Hernia hiatal", label: "Hernia hiatal" },
  { value: "Luto", label: "Luto" },
  { value: "Miopía", label: "Miopía" },
  { value: "Gastritis", label: "Gastritis" },
  { value: "Abdomen agudo", label: "Abdomen agudo" },
  { value: "Atrición dental", label: "Atrición dental" },
  { value: "Absceso dental", label: "Absceso dental" },
  { value: "Bronquiolitis", label: "Bronquiolitis" },
  { value: "Periodontitis", label: "Periodontitis" },
  { value: "Reflujo gastroesofágico", label: "Reflujo gastroesofágico" },
  { value: "Quistes ováricos", label: "Quistes ováricos" },
  { value: "Anemia", label: "Anemia" },
  { value: "Trastornos de la articulación temporomandibular", label: "Trastornos de la articulación temporomandibular" },
  { value: "Cálculos biliares", label: "Cálculos biliares" },
  { value: "Sobremordida", label: "Sobremordida" },
  { value: "Acné", label: "Acné" },
  { value: "Desgaste de rodilla", label: "Desgaste de rodilla" },
  { value: "Hernia", label: "Hernia" },
  { value: "Movilidad dentaria", label: "Movilidad dentaria" },
  { value: "Tendinitis", label: "Tendinitis" },
  { value: "Cáncer de piel", label: "Cáncer de piel" },
  { value: "Oclusión dental defectuosa", label: "Oclusión dental defectuosa" },
  { value: "Radiculopatía lumbar", label: "Radiculopatía lumbar" },
  { value: "Bulimia nerviosa", label: "Bulimia nerviosa" },
  { value: "Diente impactado", label: "Diente impactado" },
  { value: "Cáncer del colon", label: "Cáncer del colon" },
  { value: "Cáncer de próstata", label: "Cáncer de próstata" },
  { value: "Alveolitis", label: "Alveolitis" },
  { value: "Glaucoma", label: "Glaucoma" },
  { value: "Infarto agudo de miocardio", label: "Infarto agudo de miocardio" },
  { value: "Desgaste de cadera", label: "Desgaste de cadera" },
  { value: "Dolor muscular", label: "Dolor muscular" },
  { value: "Trastornos del aprendizaje", label: "Trastornos del aprendizaje" },
  { value: "Cólico infantil", label: "Cólico infantil" },
  { value: "Tendinitis del manguito de los rotadores", label: "Tendinitis del manguito de los rotadores" },
  { value: "Diarrea", label: "Diarrea" },
  { value: "Embarazo ectópico", label: "Embarazo ectópico" },
  { value: "Pie plano", label: "Pie plano" },
  { value: "Reflujo gastroesofágico en bebés", label: "Reflujo gastroesofágico en bebés" },
  { value: "Trastorno bipolar", label: "Trastorno bipolar" },
  { value: "Artrosis", label: "Artrosis" },
  { value: "Esquizofrenia", label: "Esquizofrenia" },
  { value: "Hemorroides", label: "Hemorroides" },
  { value: "Ovarios poliquísticos", label: "Ovarios poliquísticos" },
  { value: "Retinopatía diabética", label: "Retinopatía diabética" },
  { value: "Demencia", label: "Demencia" },
  { value: "Eyaculación precoz", label: "Eyaculación precoz" },
  { value: "Sangrado uterino anormal", label: "Sangrado uterino anormal" },
  { value: "Alergia alimentaria", label: "Alergia alimentaria" },
  { value: "Astigmatismo", label: "Astigmatismo" },
  { value: "Cambios precancerosos del cuello uterino", label: "Cambios precancerosos del cuello uterino" },
  { value: "Contractura cervical", label: "Contractura cervical" },
  { value: "Halitosis", label: "Halitosis" },
  { value: "Hipermetropía", label: "Hipermetropía" },
  { value: "Impactación dental", label: "Impactación dental" },
  { value: "Colecistitis crónica", label: "Colecistitis crónica" },
  { value: "Fobia social", label: "Fobia social" },
  { value: "Síndrome de los ovarios poliquísticos (PCOS)", label: "Síndrome de los ovarios poliquísticos (PCOS)" },
  { value: "Angina", label: "Angina" },
  { value: "Hombro congelado", label: "Hombro congelado" },
  { value: "Infección urinaria en niños", label: "Infección urinaria en niños" },
  { value: "Pterigión", label: "Pterigión" },
  { value: "EIP (infección genital femenina)", label: "EIP (infección genital femenina)" },
  { value: "Fiebre en niños", label: "Fiebre en niños" },
  { value: "Amigdalitis", label: "Amigdalitis" },
  { value: "Arritmias", label: "Arritmias" },
  { value: "Conjuntivitis", label: "Conjuntivitis" },
  { value: "Dermatitis del pañal", label: "Dermatitis del pañal" },
  { value: "Disfunción eréctil", label: "Disfunción eréctil" },
  { value: "Infarto de miocardio", label: "Infarto de miocardio" },
  { value: "Pie Diabético", label: "Pie Diabético" },
  { value: "Síndrome de burnout", label: "Síndrome de burnout" },
  { value: "Trastornos de la ATM", label: "Trastornos de la ATM" },
  { value: "Alopecia areata", label: "Alopecia areata" },
  { value: "Hipertensión inducida por el embarazo", label: "Hipertensión inducida por el embarazo" },
  { value: "Cáncer del cuello uterino", label: "Cáncer del cuello uterino" },
  { value: "Embarazo en la adolescencia", label: "Embarazo en la adolescencia" },
  { value: "Melasma", label: "Melasma" },
  { value: "Síndrome del ojo seco", label: "Síndrome del ojo seco" },
  { value: "Depresión posparto", label: "Depresión posparto" },
  { value: "Enfermedad de Alzheimer", label: "Enfermedad de Alzheimer" },
  { value: "Fracturas de cadera", label: "Fracturas de cadera" },
  { value: "Osteoartritis", label: "Osteoartritis" },
  { value: "Trastornos del sueño", label: "Trastornos del sueño" },
  { value: "Bradicardia", label: "Bradicardia" },
  { value: "Colitis", label: "Colitis" },
  { value: "Gastritis por estrés", label: "Gastritis por estrés" },
  { value: "Hipertiroidismo", label: "Hipertiroidismo" },
  { value: "Trastornos de la menstruación", label: "Trastornos de la menstruación" },
  { value: "Alopecia androgénica", label: "Alopecia androgénica" },
  { value: "Psoriasis", label: "Psoriasis" },
  { value: "Sinusitis", label: "Sinusitis" },
  { value: "Varicocele", label: "Varicocele" },
  { value: "Verrugas", label: "Verrugas" },
  { value: "Cáncer de pulmón", label: "Cáncer de pulmón" },
  { value: "Enfermedad inflamatoria pélvica (EIP)", label: "Enfermedad inflamatoria pélvica (EIP)" },
  { value: "Fisura anal", label: "Fisura anal" },
  { value: "Preeclampsia", label: "Preeclampsia" },
  { value: "Prognatismo", label: "Prognatismo" },
  { value: "Trastorno de la conducta alimentaria", label: "Trastorno de la conducta alimentaria" },
  { value: "Disoclusión de los dientes", label: "Disoclusión de los dientes" },
  { value: "Fracturas", label: "Fracturas" },
  { value: "Incontinencia urinaria de esfuerzo", label: "Incontinencia urinaria de esfuerzo" },
  { value: "Juanetes", label: "Juanetes" },
  { value: "Verrugas genitales", label: "Verrugas genitales" },
  { value: "Vitiligo", label: "Vitiligo" },
  { value: "Bebé prematuro", label: "Bebé prematuro" },
  { value: "Bronquitis crónica", label: "Bronquitis crónica" },
  { value: "Displasia cervical", label: "Displasia cervical" },
  { value: "Enfermedad benigna de las mamas", label: "Enfermedad benigna de las mamas" },
  { value: "Esguince", label: "Esguince" },
  { value: "Condiloma acuminado", label: "Condiloma acuminado" },
  { value: "Depresión mayor", label: "Depresión mayor" },
  { value: "Enfermedad de Parkinson", label: "Enfermedad de Parkinson" },
  { value: "Nutrición inadecuada", label: "Nutrición inadecuada" },
  { value: "Úlceras bucales", label: "Úlceras bucales" },
  { value: "Conjuntivitis alérgica", label: "Conjuntivitis alérgica" },
  { value: "Cáncer de tiroides", label: "Cáncer de tiroides" },
  { value: "Enfermedad de la vesícula biliar", label: "Enfermedad de la vesícula biliar" },
  { value: "Hipercolesterolemia", label: "Hipercolesterolemia" },
  { value: "Urticaria", label: "Urticaria" },
  { value: "Ausencia dentaria", label: "Ausencia dentaria" },
  { value: "Bursitis", label: "Bursitis" },
  { value: "Cáncer renal", label: "Cáncer renal" },
  { value: "Depresión en los ancianos", label: "Depresión en los ancianos" },
  { value: "Hígado graso", label: "Hígado graso" },
  { value: "Cálculos en las vías urinarias", label: "Cálculos en las vías urinarias" },
  { value: "Cáncer de mama", label: "Cáncer de mama" },
  { value: "Estreñimiento", label: "Estreñimiento" },
  { value: "Fibrilación auricular", label: "Fibrilación auricular" },
  { value: "Migraña", label: "Migraña" },
  { value: "Enfermedad de los ovarios poliquísticos", label: "Enfermedad de los ovarios poliquísticos" },
  { value: "Neurosis histérica", label: "Neurosis histérica" },
  { value: "Cardiopatía hipertensiva", label: "Cardiopatía hipertensiva" },
  { value: "Codo de tenista", label: "Codo de tenista" },
  { value: "Desprendimiento de retina", label: "Desprendimiento de retina" },
  { value: "Otitis", label: "Otitis" },
  { value: "Síntomas gastrointestinales", label: "Síntomas gastrointestinales" },
  { value: "Trastorno de adaptación", label: "Trastorno de adaptación" },
  { value: "Trastorno depresivo grave", label: "Trastorno depresivo grave" },
  { value: "Absceso anal", label: "Absceso anal" },
  { value: "Abuso sexual", label: "Abuso sexual" },
  { value: "Apnea del sueño de tipo obstructivo", label: "Apnea del sueño de tipo obstructivo" },
  { value: "Epilepsia", label: "Epilepsia" },
  { value: "Hiperlipidemia", label: "Hiperlipidemia" },
  { value: "Cicatriz queloide", label: "Cicatriz queloide" },
  { value: "Dolor de espalda inespecífico", label: "Dolor de espalda inespecífico" },
  { value: "Esterilidad", label: "Esterilidad" },
  { value: "Bocio", label: "Bocio" },
  { value: "Dolor abdominal", label: "Dolor abdominal" },
  { value: "Dolor en la inserción del talón", label: "Dolor en la inserción del talón" },
  { value: "Gastroenteritis", label: "Gastroenteritis" },
  { value: "Obesidad mórbida", label: "Obesidad mórbida" },
  { value: "Alergias", label: "Alergias" },
  { value: "Alergias nasales", label: "Alergias nasales" },
  { value: "Cefalea tensional", label: "Cefalea tensional" },
  { value: "Hipertrofia (hiperplasia) prostática benigna", label: "Hipertrofia (hiperplasia) prostática benigna" },
  { value: "Alergia a las proteínas de la leche (niño pequeño)", label: "Alergia a las proteínas de la leche (niño pequeño)" },
  { value: "Autismo", label: "Autismo" },
  { value: "Cirrosis", label: "Cirrosis" },
  { value: "Contracturas musculares", label: "Contracturas musculares" },
  { value: "Control de emociones", label: "Control de emociones" },
  { value: "Cáncer testicular", label: "Cáncer testicular" },
  { value: "Deshidratación", label: "Deshidratación" },
  { value: "Escoliosis", label: "Escoliosis" },
  { value: "Gastroenteritis aguda", label: "Gastroenteritis aguda" },
  { value: "Luxación Acromioclavicular", label: "Luxación Acromioclavicular" },
  { value: "Manchas de la edad", label: "Manchas de la edad" },
  { value: "Nefropatía diabética", label: "Nefropatía diabética" },
  { value: "Pólipos nasales", label: "Pólipos nasales" },
  { value: "Síndrome del túnel carpiano", label: "Síndrome del túnel carpiano" },
  { value: "Coledocolitiasis", label: "Coledocolitiasis" },
  { value: "Lunar", label: "Lunar" },
  { value: "Miedos y fobias", label: "Miedos y fobias" },
  { value: "Disco roto", label: "Disco roto" },
  { value: "Hipotiroidismo", label: "Hipotiroidismo" },
  { value: "Prolapso uterino", label: "Prolapso uterino" },
  { value: "Tabaquismo", label: "Tabaquismo" },
  { value: "Trastorno del sueño por ansiedad", label: "Trastorno del sueño por ansiedad" },
  { value: "Dependencia emocional", label: "Dependencia emocional" },
  { value: "Dermatitis seborreica", label: "Dermatitis seborreica" },
  { value: "Inestabilidad Glenohumeral", label: "Inestabilidad Glenohumeral" },
  { value: "Trastornos cardiovasculares", label: "Trastornos cardiovasculares" },
  { value: "Cáncer vesical", label: "Cáncer vesical" },
  { value: "Dermatitis alérgica", label: "Dermatitis alérgica" },
  { value: "Fracturas por compresión o aplastamiento vertebral", label: "Fracturas por compresión o aplastamiento vertebral" },
  { value: "Vértigo postural benigno", label: "Vértigo postural benigno" },
  { value: "Anorexia", label: "Anorexia" },
  { value: "Cicatriz hipertrófica", label: "Cicatriz hipertrófica" },
  { value: "Curvatura de la columna", label: "Curvatura de la columna" },
  { value: "Cálculos renales", label: "Cálculos renales" },
  { value: "Enfermedad fibroquística de las mamas", label: "Enfermedad fibroquística de las mamas" },
  { value: "Fractura de antebrazo", label: "Fractura de antebrazo" },
  { value: "Blefaritis", label: "Blefaritis" },
  { value: "Cistitis", label: "Cistitis" },
  { value: "Derrame pleural", label: "Derrame pleural" },
  { value: "Laringitis", label: "Laringitis" },
  { value: "Pancreatitis", label: "Pancreatitis" },
  { value: "Autolesiones", label: "Autolesiones" },
  { value: "Condromalacia rotuliana", label: "Condromalacia rotuliana" },
  { value: "Cáncer de los ovarios", label: "Cáncer de los ovarios" },
  { value: "Cáncer del estómago", label: "Cáncer del estómago" },
  { value: "Dedos en garra", label: "Dedos en garra" },
  { value: "Insomnio crónico", label: "Insomnio crónico" },
  { value: "Trastorno límite de la personalidad", label: "Trastorno límite de la personalidad" },
  { value: "Tristeza", label: "Tristeza" },
  { value: "Bronconeumonía", label: "Bronconeumonía" },
  { value: "Colelitiasis", label: "Colelitiasis" },
  { value: "Degeneración macular relacionada con la edad (AMD)", label: "Degeneración macular relacionada con la edad (AMD)" },
  { value: "Fatiga crónica", label: "Fatiga crónica" },
  { value: "Fibromialgia", label: "Fibromialgia" },
  { value: "Infección aguda de las vías urinarias (IVU aguda)", label: "Infección aguda de las vías urinarias (IVU aguda)" },
  { value: "Lesiones ligamentarias de rodillas", label: "Lesiones ligamentarias de rodillas" },
  { value: "Muelas del juicio", label: "Muelas del juicio" },
  { value: "Amelogénesis imperfecta", label: "Amelogénesis imperfecta" },
  { value: "Apnea del sueño", label: "Apnea del sueño" },
  { value: "Candidiasis vaginal", label: "Candidiasis vaginal" },
  { value: "Fractura coronal", label: "Fractura coronal" },
  { value: "Fractura de fémur", label: "Fractura de fémur" },
  { value: "Hepatitis", label: "Hepatitis" },
  { value: "Presión arterial alta (Hipertensión)", label: "Presión arterial alta (Hipertensión)" },
  { value: "Trastorno bipolar afectivo", label: "Trastorno bipolar afectivo" },
  { value: "Trastornos del sueño en personas mayores", label: "Trastornos del sueño en personas mayores" },
  { value: "Diabetes tipo 1", label: "Diabetes tipo 1" },
  { value: "Distimia", label: "Distimia" },
  { value: "Dolor de rodilla", label: "Dolor de rodilla" },
  { value: "EPOC", label: "EPOC" },
  { value: "Rosácea", label: "Rosácea" },
  { value: "Tenosinovitis", label: "Tenosinovitis" },
  { value: "Trastorno del espectro autista (TEA)", label: "Trastorno del espectro autista (TEA)" },
  { value: "Anomalía dentaria", label: "Anomalía dentaria" },
  { value: "Ojo rojo", label: "Ojo rojo" },
  { value: "Orzuelo", label: "Orzuelo" },
  { value: "Relaciones insanas", label: "Relaciones insanas" },
  { value: "Síndrome de Sjogren", label: "Síndrome de Sjogren" },
  { value: "Taquicardia", label: "Taquicardia" },
  { value: "Trauma", label: "Trauma" },
  { value: "Artritis", label: "Artritis" },
  { value: "Coronavirus COVID-19", label: "Coronavirus COVID-19" },
  { value: "Dermatitis por contacto", label: "Dermatitis por contacto" },
  { value: "Dolor post endodoncia", label: "Dolor post endodoncia" },
  { value: "Erosión Dental", label: "Erosión Dental" },
  { value: "Esofagitis por reflujo", label: "Esofagitis por reflujo" },
  { value: "Espondilitis anquilosante", label: "Espondilitis anquilosante" },
  { value: "Gastroenteritis bacteriana con diarrea infecciosa", label: "Gastroenteritis bacteriana con diarrea infecciosa" },
  { value: "Hidrocele", label: "Hidrocele" },
  { value: "Miedo", label: "Miedo" },
  { value: "Resistencia a la insulina", label: "Resistencia a la insulina" },
  { value: "Síndrome de caídas", label: "Síndrome de caídas" },
  { value: "Absceso de Bartolino", label: "Absceso de Bartolino" },
  { value: "Apatía sexual", label: "Apatía sexual" },
  { value: "Estenosis aórtica", label: "Estenosis aórtica" },
  { value: "Fimosis", label: "Fimosis" },
  { value: "Glomerulonefritis", label: "Glomerulonefritis" },
  { value: "Hipocondría", label: "Hipocondría" },
  { value: "Inseguridad", label: "Inseguridad" },
  { value: "Intolerancia a la lactosa", label: "Intolerancia a la lactosa" },
  { value: "Onicomicosis", label: "Onicomicosis" },
  { value: "Ronquido", label: "Ronquido" },
  { value: "Traumatismo dental", label: "Traumatismo dental" },
  { value: "Aborto incompleto", label: "Aborto incompleto" },
  { value: "Aflicción", label: "Aflicción" },
  { value: "Asma bronquial", label: "Asma bronquial" },
  { value: "Deseo sexual inhibido", label: "Deseo sexual inhibido" },
  { value: "Dislexia", label: "Dislexia" },
  { value: "Dolor de columna", label: "Dolor de columna" },
  { value: "Enfermedades de la tiroides", label: "Enfermedades de la tiroides" },
  { value: "Melanoma", label: "Melanoma" },
  { value: "Nódulo tiroideo", label: "Nódulo tiroideo" },
  { value: "Avulsión dental", label: "Avulsión dental" },
  { value: "Bulímia", label: "Bulímia" },
  { value: "Cicatrices de acné", label: "Cicatrices de acné" },
  { value: "Crisis respiratoria en recién nacidos", label: "Crisis respiratoria en recién nacidos" },
  { value: "Fístula dental o en encía", label: "Fístula dental o en encía" },
  { value: "Fractura de la pelvis", label: "Fractura de la pelvis" },
  { value: "Hemorragia cerebral", label: "Hemorragia cerebral" },
  { value: "Hombro de lanzador", label: "Hombro de lanzador" },
  { value: "Hombro de tenista", label: "Hombro de tenista" },
  { value: "Lesiones ligamentarias en mano y muñeca", label: "Lesiones ligamentarias en mano y muñeca" },
  { value: "Parálisis facial", label: "Parálisis facial" },
  { value: "Sonrisa gingival", label: "Sonrisa gingival" },
  { value: "Trastorno de personalidad narcisista", label: "Trastorno de personalidad narcisista" },
  { value: "Tuberculosis pulmonar", label: "Tuberculosis pulmonar" },
  { value: "Tumor cerebral en niños", label: "Tumor cerebral en niños" },
  { value: "Adenoma de tiroides", label: "Adenoma de tiroides" },
  { value: "Aneurisma cerebral", label: "Aneurisma cerebral" },
  { value: "Artritis reumatoide", label: "Artritis reumatoide" },
  { value: "Capsulitis adhesiva", label: "Capsulitis adhesiva" },
  { value: "Cardiomiopatía dilatada", label: "Cardiomiopatía dilatada" },
  { value: "Conducta", label: "Conducta" },
  { value: "Criptorquidia", label: "Criptorquidia" },
  { value: "Dependencia del alcohol", label: "Dependencia del alcohol" },
  { value: "Dolor de cadera", label: "Dolor de cadera" },
  { value: "Fibrosis pulmonar", label: "Fibrosis pulmonar" },
  { value: "Gigantomastia", label: "Gigantomastia" },
  { value: "Ictericia del recién nacido", label: "Ictericia del recién nacido" },
  { value: "Insuficiencia renal aguda", label: "Insuficiencia renal aguda" },
  { value: "Ludopatía", label: "Ludopatía" },
  { value: "Lupus", label: "Lupus" },
  { value: "Síndrome del colon irritable (IBS)", label: "Síndrome del colon irritable (IBS)" },
  { value: "Síndrome nefrótico", label: "Síndrome nefrótico" },
  { value: "Vacío", label: "Vacío" },
  { value: "Agujero macular", label: "Agujero macular" },
  { value: "Cardiopatía congénita", label: "Cardiopatía congénita" },
  { value: "Dolor de cabeza por contracción muscular", label: "Dolor de cabeza por contracción muscular" },
  { value: "Hidrocefalia", label: "Hidrocefalia" },
  { value: "Obstrucción intestinal", label: "Obstrucción intestinal" },
  { value: "Presbicia", label: "Presbicia" },
  { value: "Síndrome de dificultad respiratoria en neonatos", label: "Síndrome de dificultad respiratoria en neonatos" },
  { value: "Tumor cerebral en adultos", label: "Tumor cerebral en adultos" },
  { value: "Adenoides agrandadas", label: "Adenoides agrandadas" },
  { value: "Amenorrea primaria", label: "Amenorrea primaria" },
  { value: "Cardiopatías", label: "Cardiopatías" },
  { value: "Cáncer colorrectal", label: "Cáncer colorrectal" },
  { value: "Dedo del pie en martillo", label: "Dedo del pie en martillo" },
  { value: "Derrame cerebral", label: "Derrame cerebral" },
  { value: "Edema macular", label: "Edema macular" },
  { value: "Fibroadenoma de mama", label: "Fibroadenoma de mama" },
  { value: "Fluorosis", label: "Fluorosis" },
  { value: "Hipertensión pulmonar", label: "Hipertensión pulmonar" },
  { value: "Linfoma de Hodgkin", label: "Linfoma de Hodgkin" },
  { value: "Queratocono", label: "Queratocono" },
  { value: "Trastorno de alimentación en la lactancia y en la primera infancia", label: "Trastorno de alimentación en la lactancia y en la primera infancia" },
  { value: "Acalasia", label: "Acalasia" },
  { value: "Artritis psoriásica", label: "Artritis psoriásica" },
  { value: "Cáncer de piel en célula basal", label: "Cáncer de piel en célula basal" },
  { value: "Cáncer de testículos", label: "Cáncer de testículos" },
  { value: "Delgadez", label: "Delgadez" },
  { value: "Demencia vascular", label: "Demencia vascular" },
  { value: "Desregulación disruptiva del estado de ánimo", label: "Desregulación disruptiva del estado de ánimo" },
  { value: "Epicondilitis humeral", label: "Epicondilitis humeral" },
  { value: "Faringitis bacteriana", label: "Faringitis bacteriana" },
  { value: "Fractura de mano", label: "Fractura de mano" },
  { value: "Hombro de nadador", label: "Hombro de nadador" },
  { value: "Infección urinaria en adultos", label: "Infección urinaria en adultos" },
  { value: "Molusco contagioso", label: "Molusco contagioso" },
  { value: "Niveles elevados de colesterol y triglicéridos", label: "Niveles elevados de colesterol y triglicéridos" },
  { value: "Quiste pilonidal", label: "Quiste pilonidal" },
  { value: "Radiculopatía cervical", label: "Radiculopatía cervical" },
  { value: "Síncope", label: "Síncope" },
  { value: "Trastorno por atracón", label: "Trastorno por atracón" },
  { value: "Varicela", label: "Varicela" },
  { value: "Accidente cerebrovascular isquémico", label: "Accidente cerebrovascular isquémico" },
  { value: "Cervicitis", label: "Cervicitis" },
  { value: "Dolor de cabeza", label: "Dolor de cabeza" },
  { value: "Drogadicción", label: "Drogadicción" },
  { value: "Enfermedad cerebrovascular", label: "Enfermedad cerebrovascular" },
  { value: "Estrabismo", label: "Estrabismo" },
  { value: "Irratibilidad", label: "Irratibilidad" },
  { value: "Lesión facial", label: "Lesión facial" },
  { value: "Psicosis", label: "Psicosis" },
  { value: "Resfriado común", label: "Resfriado común" },
  { value: "Trastornos en la alimentación del anciano", label: "Trastornos en la alimentación del anciano" },
  { value: "Trombosis venosa profunda", label: "Trombosis venosa profunda" },
  { value: "Verrugas del pene", label: "Verrugas del pene" },
  { value: "Violencia de género", label: "Violencia de género" },
  { value: "Alopecia en hombres", label: "Alopecia en hombres" },
  { value: "Anemia ferropénica en niños", label: "Anemia ferropénica en niños" },
  { value: "Ausencia de la menstruación", label: "Ausencia de la menstruación" },
  { value: "Convulsiones febriles", label: "Convulsiones febriles" },
  { value: "Dermatomiositis", label: "Dermatomiositis" },
  { value: "Enuresis", label: "Enuresis" },
  { value: "Herpes genital", label: "Herpes genital" },
  { value: "Infección del oído", label: "Infección del oído" },
  { value: "Insomnio psicofisiológico (aprendido)", label: "Insomnio psicofisiológico (aprendido)" },
  { value: "Lesiones del tendón rotuliano", label: "Lesiones del tendón rotuliano" },
  { value: "Reflujo vesicoureteral", label: "Reflujo vesicoureteral" },
  { value: "Trastorno de identidad de género", label: "Trastorno de identidad de género" },
  { value: "Trastornos hormonales", label: "Trastornos hormonales" },
  { value: "Trauma ocular", label: "Trauma ocular" },
  { value: "Úlceras e infecciones corneales", label: "Úlceras e infecciones corneales" },
  { value: "Abuso sexual infantil", label: "Abuso sexual infantil" },
  { value: "Angina crónica", label: "Angina crónica" },
  { value: "Angina inestable", label: "Angina inestable" },
  { value: "Celulitis", label: "Celulitis" },
  { value: "Compresión de la médula espinal", label: "Compresión de la médula espinal" },
  { value: "Eliminación de amalgamas", label: "Eliminación de amalgamas" },
  { value: "Embarazo múltiple", label: "Embarazo múltiple" },
  { value: "Enfermedades gastrointestinales", label: "Enfermedades gastrointestinales" },
  { value: "Enfermedades y dolor crónico", label: "Enfermedades y dolor crónico" },
  { value: "Falla renal crónica", label: "Falla renal crónica" },
  { value: "Herpes zóster (culebrilla)", label: "Herpes zóster (culebrilla)" },
  { value: "Hipoacusia relacionada con la edad", label: "Hipoacusia relacionada con la edad" },
  { value: "Hipotiroidismo en adultos", label: "Hipotiroidismo en adultos" },
  { value: "Hombro rígido", label: "Hombro rígido" },
  { value: "Linfoma no Hodgkin", label: "Linfoma no Hodgkin" },
  { value: "Miocardiopatías", label: "Miocardiopatías" },
  { value: "Neuropatía del nervio ciático", label: "Neuropatía del nervio ciático" },
  { value: "Pericarditis", label: "Pericarditis" },
  { value: "Pielonefritis", label: "Pielonefritis" },
  { value: "Pinzamiento Subacromial", label: "Pinzamiento Subacromial" },
  { value: "Rodilla vara", label: "Rodilla vara" },
  { value: "Trastorno de la personalidad pasivo-agresiva", label: "Trastorno de la personalidad pasivo-agresiva" },
  { value: "Trastornos asociados con el vértigo", label: "Trastornos asociados con el vértigo" },
  { value: "Úlcera gastroduodenal aguda", label: "Úlcera gastroduodenal aguda" },
  { value: "Aborto espontáneo", label: "Aborto espontáneo" },
  { value: "Acné vulgar", label: "Acné vulgar" },
  { value: "Anemia por deficiencia de hierro en los niños", label: "Anemia por deficiencia de hierro en los niños" },
  { value: "Ateroesclerosis", label: "Ateroesclerosis" },
  { value: "Dolor de hombro", label: "Dolor de hombro" },
  { value: "Embarazo de bajo riesgo", label: "Embarazo de bajo riesgo" },
  { value: "Espondilolistesis", label: "Espondilolistesis" },
  { value: "Estenosis de la válvula aórtica", label: "Estenosis de la válvula aórtica" },
  { value: "Estreñimiento en niños", label: "Estreñimiento en niños" },
  { value: "Falla cardíaca", label: "Falla cardíaca" },
  { value: "Insuficiencia crónica del riñón", label: "Insuficiencia crónica del riñón" },
  { value: "Insuficiencia venosa", label: "Insuficiencia venosa" },
  { value: "Litiasis renal", label: "Litiasis renal" },
  { value: "Masas cutáneas de grasa", label: "Masas cutáneas de grasa" },
  { value: "Pancreatitis aguda", label: "Pancreatitis aguda" },
  { value: "Parto prematuro", label: "Parto prematuro" },
  { value: "Quemaduras", label: "Quemaduras" },
  { value: "TEPT", label: "TEPT" },
  { value: "Trastorno de oposición desafiante", label: "Trastorno de oposición desafiante" },
  { value: "Trastornos de la voz", label: "Trastornos de la voz" },
  { value: "Úlceras venosas", label: "Úlceras venosas" },
  { value: "Alergias a fármacos", label: "Alergias a fármacos" },
  { value: "Ambliopía", label: "Ambliopía" },
  { value: "Arrancamiento compulsivo del cabello", label: "Arrancamiento compulsivo del cabello" },
  { value: "Cistitis aguda", label: "Cistitis aguda" },
  { value: "Codo de niñera", label: "Codo de niñera" },
  { value: "Comportamiento psicótico", label: "Comportamiento psicótico" },
  { value: "Depresión en el embarazo", label: "Depresión en el embarazo" },
  { value: "Dislalia", label: "Dislalia" },
  { value: "Eclampsia", label: "Eclampsia" },
  { value: "Encías expuestas", label: "Encías expuestas" },
  { value: "Esclerodermia", label: "Esclerodermia" },
  { value: "Esofagitis", label: "Esofagitis" },
  { value: "Fractura de la base del metatarso", label: "Fractura de la base del metatarso" },
  { value: "Gingivitis ulceronecrosante aguda", label: "Gingivitis ulceronecrosante aguda" },
  { value: "Infección aguda del oído", label: "Infección aguda del oído" },
  { value: "Infección crónica de los senos paranasales", label: "Infección crónica de los senos paranasales" },
  { value: "Infección urinaria recurrente", label: "Infección urinaria recurrente" },
  { value: "Leucemia", label: "Leucemia" },
  { value: "Nefrolitiasis", label: "Nefrolitiasis" },
  { value: "Uveítis", label: "Uveítis" },
  { value: "Agrandamiento de la próstata", label: "Agrandamiento de la próstata" },
  { value: "Colesterol", label: "Colesterol" },
  { value: "Cálculos en el tracto urinario", label: "Cálculos en el tracto urinario" },
  { value: "Dolor en la espalda", label: "Dolor en la espalda" },
  { value: "Esclerosis múltiple", label: "Esclerosis múltiple" },
  { value: "Espondiloartropatía", label: "Espondiloartropatía" },
  { value: "Gota aguda", label: "Gota aguda" },
  { value: "Hemofilia", label: "Hemofilia" },
  { value: "Hiperhidrosis", label: "Hiperhidrosis" },
  { value: "Insuficiencia arterial", label: "Insuficiencia arterial" },
  { value: "Linfedema", label: "Linfedema" },
  { value: "Nefritis lúpica", label: "Nefritis lúpica" },
  { value: "Nevos", label: "Nevos" },
  { value: "Obstrucción del conducto lagrimal", label: "Obstrucción del conducto lagrimal" },
  { value: "Onicocriptosis", label: "Onicocriptosis" },
  { value: "Parálisis del nervio facial", label: "Parálisis del nervio facial" },
  { value: "Pie equino varo", label: "Pie equino varo" },
  { value: "Piedras en el riñón", label: "Piedras en el riñón" },
  { value: "Púrpura trombocitopénica idiopática (ITP)", label: "Púrpura trombocitopénica idiopática (ITP)" },
  { value: "Quiste epidermoide", label: "Quiste epidermoide" },
  { value: "Quiste sebáceo", label: "Quiste sebáceo" },
  { value: "Síndrome antifosfolípido", label: "Síndrome antifosfolípido" },
  { value: "Síndrome de apnea obstructiva del sueño", label: "Síndrome de apnea obstructiva del sueño" },
  { value: "Síndrome de dolor pélvico crónico", label: "Síndrome de dolor pélvico crónico" },
  { value: "Trastorno de personalidad histriónica", label: "Trastorno de personalidad histriónica" },
  { value: "Traumatismo facial", label: "Traumatismo facial" },
  { value: "Tumor cerebral canceroso (metastásico)", label: "Tumor cerebral canceroso (metastásico)" },
  { value: "Acné rosácea", label: "Acné rosácea" },
  { value: "Adherencias", label: "Adherencias" },
  { value: "Amenorrea secundaria", label: "Amenorrea secundaria" },
  { value: "Angina estable", label: "Angina estable" },
  { value: "Aversión al sexo", label: "Aversión al sexo" },
  { value: "Cardiopatía coronaria", label: "Cardiopatía coronaria" },
  { value: "Craneosinostosis", label: "Craneosinostosis" },
  { value: "Defensas bajas", label: "Defensas bajas" },
  { value: "Deformidad en valgo del dedo gordo", label: "Deformidad en valgo del dedo gordo" },
  { value: "Degeneración macular", label: "Degeneración macular" },
  { value: "Dentición", label: "Dentición" },
  { value: "Displasia congénita de la cadera", label: "Displasia congénita de la cadera" },
  { value: "Enfermedad de Meniere", label: "Enfermedad de Meniere" },
  { value: "Envejecimiento cutáneo", label: "Envejecimiento cutáneo" },
  { value: "Estenosis mitral", label: "Estenosis mitral" },
  { value: "Gangrena de tejidos blandos", label: "Gangrena de tejidos blandos" },
  { value: "Hiperplasia prostática", label: "Hiperplasia prostática" },
  { value: "Infertilidad masculina", label: "Infertilidad masculina" },
  { value: "Lesión corneal", label: "Lesión corneal" },
  { value: "Trastorno del control de los impulsos", label: "Trastorno del control de los impulsos" },
  { value: "Vulvovaginitis", label: "Vulvovaginitis" },
  { value: "Accidente cerebrovascular hemorrágico", label: "Accidente cerebrovascular hemorrágico" },
  { value: "Alta miopía", label: "Alta miopía" },
  { value: "Ascitis", label: "Ascitis" },
  { value: "Coagulopatía", label: "Coagulopatía" },
  { value: "Crup", label: "Crup" },
  { value: "Cáncer de cabeza y cuello", label: "Cáncer de cabeza y cuello" },
  { value: "Divertículo de Meckel", label: "Divertículo de Meckel" },
  { value: "Enfermedad coronaria (CHD)", label: "Enfermedad coronaria (CHD)" },
  { value: "Enfermedad inflamatoria intestinal", label: "Enfermedad inflamatoria intestinal" },
  { value: "Enfermedad renal", label: "Enfermedad renal" },
  { value: "Mucocele", label: "Mucocele" },
  { value: "Peritonitis", label: "Peritonitis" },
  { value: "Pesadillas constantes", label: "Pesadillas constantes" },
  { value: "Pulpitis", label: "Pulpitis" },
  { value: "Rechazo al trasplante", label: "Rechazo al trasplante" },
  { value: "Síndrome de dolor miofascial", label: "Síndrome de dolor miofascial" },
  { value: "Tapón de cerumen", label: "Tapón de cerumen" },
  { value: "Trastorno Déficit de atención e hiperactividad", label: "Trastorno Déficit de atención e hiperactividad" },
  { value: "Trastorno del desarrollo de la lectura", label: "Trastorno del desarrollo de la lectura" },
  { value: "Trastornos del desarrollo sexual", label: "Trastornos del desarrollo sexual" },
  { value: "Trombocitopenia", label: "Trombocitopenia" },
  { value: "Tumor tiroideo", label: "Tumor tiroideo" },
  { value: "Tumores o protuberancias en las mamas", label: "Tumores o protuberancias en las mamas" },
  { value: "Absceso mamario", label: "Absceso mamario" },
  { value: "Abuso del alcohol", label: "Abuso del alcohol" },
  { value: "Adherencia intraperitoneal", label: "Adherencia intraperitoneal" },
  { value: "Agrandamiento de adenoides", label: "Agrandamiento de adenoides" },
  { value: "Anemia hemolítica", label: "Anemia hemolítica" },
  { value: "Ataque cardíaco", label: "Ataque cardíaco" },
  { value: "Cerumen (cera del oído)", label: "Cerumen (cera del oído)" },
  { value: "Chalazión", label: "Chalazión" },
  { value: "Contractura de Dupuytren", label: "Contractura de Dupuytren" },
  { value: "Cuello torcido", label: "Cuello torcido" },
  { value: "Cálculo en el conducto biliar", label: "Cálculo en el conducto biliar" },
  { value: "Cáncer de vejiga", label: "Cáncer de vejiga" },
  { value: "Delirium", label: "Delirium" },
  { value: "Dengue", label: "Dengue" },
  { value: "Deseo sexual hipoactivo", label: "Deseo sexual hipoactivo" },
  { value: "Discapacidad intelectual", label: "Discapacidad intelectual" },
  { value: "Embarazo molar", label: "Embarazo molar" },
  { value: "Enfermedad cardíaca isquémica", label: "Enfermedad cardíaca isquémica" },
  { value: "Enfermedad celíaca (esprúe)", label: "Enfermedad celíaca (esprúe)" },
  { value: "Epicondilitis lateral", label: "Epicondilitis lateral" },
  { value: "Espondilitis", label: "Espondilitis" },
  { value: "Exceso de flujo vaginal - leucorrea", label: "Exceso de flujo vaginal - leucorrea" },
  { value: "Gastritis crónica", label: "Gastritis crónica" },
  { value: "Hidronefrosis", label: "Hidronefrosis" },
  { value: "Influenza", label: "Influenza" },
  { value: "Insuficiencia renal", label: "Insuficiencia renal" },
  { value: "Membrana epirretiniana macular", label: "Membrana epirretiniana macular" },
  { value: "Mieloma múltiple", label: "Mieloma múltiple" },
  { value: "Parálisis cerebral", label: "Parálisis cerebral" },
  { value: "Pseudoartrosis", label: "Pseudoartrosis" },
  { value: "Párpados caídos", label: "Párpados caídos" },
  { value: "Restricción del crecimiento intrauterino", label: "Restricción del crecimiento intrauterino" },
  { value: "Ronchas o habones", label: "Ronchas o habones" },
  { value: "Temblor inducido por fármacos", label: "Temblor inducido por fármacos" },
  { value: "Trastornos de la marcha", label: "Trastornos de la marcha" },
  { value: "Trastornos de las glándulas salivales", label: "Trastornos de las glándulas salivales" },
  { value: "Venas varicosas", label: "Venas varicosas" },
  { value: "Alcoholismo", label: "Alcoholismo" },
  { value: "Alergia al moho, la caspa y el polvo", label: "Alergia al moho, la caspa y el polvo" },
  { value: "Balanitis", label: "Balanitis" },
  { value: "Cambios en la piel inducidos por el sol", label: "Cambios en la piel inducidos por el sol" },
  { value: "Colangitis", label: "Colangitis" },
  { value: "Cáncer de endometrio", label: "Cáncer de endometrio" },
  { value: "Demencia con los cuerpos de Lewy", label: "Demencia con los cuerpos de Lewy" },
  { value: "Encefalopatía hepática", label: "Encefalopatía hepática" },
  { value: "Enfermedad de von Willebrand", label: "Enfermedad de von Willebrand" },
  { value: "Enfermedad ovárica poliquística", label: "Enfermedad ovárica poliquística" },
  { value: "Estenosis pilórica", label: "Estenosis pilórica" },
  { value: "Falta de fluidez en el lenguaje", label: "Falta de fluidez en el lenguaje" },
  { value: "Hemorragia subconjuntival", label: "Hemorragia subconjuntival" },
  { value: "Hipercolesterolemia familiar", label: "Hipercolesterolemia familiar" },
  { value: "Hiperparatiroidismo", label: "Hiperparatiroidismo" },
  { value: "Inclusión dentaria", label: "Inclusión dentaria" },
  { value: "Infecciones frecuentes de garganta", label: "Infecciones frecuentes de garganta" },
  { value: "Infección de las vías urinarias (IVU) en adultos", label: "Infección de las vías urinarias (IVU) en adultos" },
  { value: "Intolerancia al gluten", label: "Intolerancia al gluten" },
  { value: "Labio leporino y paladar hendido", label: "Labio leporino y paladar hendido" },
  { value: "Neuroma de Morton", label: "Neuroma de Morton" },
  { value: "Oclusión de las venas retinianas", label: "Oclusión de las venas retinianas" },
  { value: "Pólipos cervicales", label: "Pólipos cervicales" },
  { value: "Síndrome del intestino irritable", label: "Síndrome del intestino irritable" },
  { value: "Síndrome premenstrual (SPM)", label: "Síndrome premenstrual (SPM)" },
  { value: "Tendinitis, esguinces articulares", label: "Tendinitis, esguinces articulares" },
  { value: "Terror nocturno", label: "Terror nocturno" },
  { value: "Tumor de la médula espinal", label: "Tumor de la médula espinal" },
  { value: "Verrugas plantares", label: "Verrugas plantares" },
  { value: "Aborto inevitable", label: "Aborto inevitable" },
  { value: "Adenomioma", label: "Adenomioma" },
  { value: "Adenomiosis", label: "Adenomiosis" },
  { value: "Alergias a las mascotas", label: "Alergias a las mascotas" },
  { value: "Amenaza de aborto espontáneo", label: "Amenaza de aborto espontáneo" },
  { value: "Anemia aplásica adquirida", label: "Anemia aplásica adquirida" },
  { value: "Anemia ferropénica", label: "Anemia ferropénica" },
  { value: "Caspa", label: "Caspa" },
  { value: "Cefalea en racimo", label: "Cefalea en racimo" },
  { value: "Cifoescoliosis", label: "Cifoescoliosis" },
  { value: "Colitis ulcerosa", label: "Colitis ulcerosa" },
  { value: "Coágulo en las piernas", label: "Coágulo en las piernas" },
  { value: "Cáncer de pene", label: "Cáncer de pene" },
  { value: "Cáncer del páncreas", label: "Cáncer del páncreas" },
  { value: "Defectos de refracción", label: "Defectos de refracción" },
  { value: "Desgastes de articulaciones", label: "Desgastes de articulaciones" },
  { value: "Displasia del desarrollo de la cadera", label: "Displasia del desarrollo de la cadera" },
  { value: "Dolor de huesos y articulaciones", label: "Dolor de huesos y articulaciones" },
  { value: "Ectropión", label: "Ectropión" },
  { value: "Embarazo abdominal", label: "Embarazo abdominal" },
  { value: "Endocarditis", label: "Endocarditis" },
  { value: "Flebitis", label: "Flebitis" },
  { value: "Fístula gastrointestinal", label: "Fístula gastrointestinal" },
  { value: "Gingivoestomatitis", label: "Gingivoestomatitis" },
  { value: "Infección recurrente de las vías urinarias", label: "Infección recurrente de las vías urinarias" },
  { value: "Meningitis", label: "Meningitis" },
  { value: "Queratosis: tumores benignos de la piel", label: "Queratosis: tumores benignos de la piel" },
  { value: "Tendinitis bicipital", label: "Tendinitis bicipital" },
  { value: "Úlcera gástrica", label: "Úlcera gástrica" },
  { value: "Absceso hepático bacteriano", label: "Absceso hepático bacteriano" },
  { value: "Absceso intraabdominal", label: "Absceso intraabdominal" },
  { value: "Absceso periamigdalino", label: "Absceso periamigdalino" },
  { value: "Acidez", label: "Acidez" },
  { value: "Aneurisma aórtico abdominal", label: "Aneurisma aórtico abdominal" },
  { value: "Artritis gotosa aguda", label: "Artritis gotosa aguda" },
  { value: "Curvatura del pene", label: "Curvatura del pene" },
  { value: "Dermatitis y úlceras por estasis", label: "Dermatitis y úlceras por estasis" },
  { value: "Displasia del desarrollo de la articulación de la cadera", label: "Displasia del desarrollo de la articulación de la cadera" },
  { value: "Dolor de mano", label: "Dolor de mano" },
  { value: "Eccema", label: "Eccema" },
  { value: "Embarazo anembrionario (Huevo huero)", label: "Embarazo anembrionario (Huevo huero)" },
  { value: "Enfermedad de Crohn", label: "Enfermedad de Crohn" },
  { value: "Enfermedad de Osgood-Schlatter", label: "Enfermedad de Osgood-Schlatter" },
  { value: "Enfermedad de Quervain", label: "Enfermedad de Quervain" },
  { value: "Estenosis uretral", label: "Estenosis uretral" },
  { value: "Hemorroides trombosadas", label: "Hemorroides trombosadas" },
  { value: "Hernia crural", label: "Hernia crural" },
  { value: "Hipospadias", label: "Hipospadias" },
  { value: "Infarto cerebral", label: "Infarto cerebral" },
  { value: "Infecciones de vías respiratorias de repetición (o recurrentes)", label: "Infecciones de vías respiratorias de repetición (o recurrentes)" },
  { value: "Infección del riñón", label: "Infección del riñón" },
  { value: "Insuficiencia aguda del riñón", label: "Insuficiencia aguda del riñón" },
  { value: "Insuficiencia venosa crónica", label: "Insuficiencia venosa crónica" },
  { value: "Luxación parcial del codo", label: "Luxación parcial del codo" },
  { value: "Mioma", label: "Mioma" },
  { value: "Perimenopausia", label: "Perimenopausia" },
  { value: "Prolapso de disco intervertebral", label: "Prolapso de disco intervertebral" },
  { value: "Reacción anafiláctica", label: "Reacción anafiláctica" },
  { value: "Shock anafiláctico", label: "Shock anafiláctico" },
  { value: "Subluxación del codo", label: "Subluxación del codo" },
  { value: "Síndrome compartimental", label: "Síndrome compartimental" },
  { value: "Tendinitis del talón", label: "Tendinitis del talón" },
  { value: "Trastorno de pánico con agorafobia", label: "Trastorno de pánico con agorafobia" },
  { value: "Trastornos por inmunodeficiencia", label: "Trastornos por inmunodeficiencia" },
  { value: "Trauma dental", label: "Trauma dental" },
  { value: "Úlcera péptica", label: "Úlcera péptica" },
  { value: "Accidente cerebrovascular", label: "Accidente cerebrovascular" },
  { value: "Acumulación de placa en las arterias", label: "Acumulación de placa en las arterias" },
  { value: "Alergias en ambientes interiores", label: "Alergias en ambientes interiores" },
  { value: "Artritis por gota crónica", label: "Artritis por gota crónica" },
  { value: "Cataratas congénitas", label: "Cataratas congénitas" },
  { value: "Cetoacidosis diabética", label: "Cetoacidosis diabética" },
  { value: "Cáncer de vagina", label: "Cáncer de vagina" },
  { value: "Cáncer endometrial", label: "Cáncer endometrial" },
  { value: "Cáncer laríngeo", label: "Cáncer laríngeo" },
  { value: "Deseo sexual hiperactivo", label: "Deseo sexual hiperactivo" },
  { value: "Diarrea bacteriana", label: "Diarrea bacteriana" },
  { value: "Diverticulosis", label: "Diverticulosis" },
  { value: "Dolor asociado con la ovulación", label: "Dolor asociado con la ovulación" },
  { value: "Dolor en mitad del ciclo menstrual", label: "Dolor en mitad del ciclo menstrual" },
  { value: "Dolor oncológico", label: "Dolor oncológico" },
  { value: "Enfermedad de Cushing", label: "Enfermedad de Cushing" },
  { value: "Enfermedad renal terminal", label: "Enfermedad renal terminal" },
  { value: "Esclerosis sistémica", label: "Esclerosis sistémica" },
  { value: "Espondilosis cervical", label: "Espondilosis cervical" },
  { value: "Estenosis raquídea", label: "Estenosis raquídea" },
  { value: "Gangrena", label: "Gangrena" },
  { value: "Gonorrea", label: "Gonorrea" },
  { value: "Hematoma epidural", label: "Hematoma epidural" },
  { value: "Heridas", label: "Heridas" },
  { value: "Hernia diafragmática", label: "Hernia diafragmática" },
  { value: "Hidrocele de la túnica vaginal del testículo (proceso vaginal)", label: "Hidrocele de la túnica vaginal del testículo (proceso vaginal)" },
  { value: "Hiperplasia endometrial benigna", label: "Hiperplasia endometrial benigna" },
  { value: "Infección aguda de la vejiga", label: "Infección aguda de la vejiga" },
  { value: "Infección complicada de las vías urinarias", label: "Infección complicada de las vías urinarias" },
  { value: "Inflamación de pies", label: "Inflamación de pies" },
  { value: "Insuficiencia mitral", label: "Insuficiencia mitral" },
  { value: "Intolerancia a la glucosa durante el embarazo", label: "Intolerancia a la glucosa durante el embarazo" },
  { value: "Laberíntitis", label: "Laberíntitis" },
  { value: "Lipoma cervical", label: "Lipoma cervical" },
  { value: "Nariz bulbosa", label: "Nariz bulbosa" },
  { value: "Neurodivergencia", label: "Neurodivergencia" },
  { value: "Neutropenia", label: "Neutropenia" },
  { value: "Peritonitis asociada con diálisis", label: "Peritonitis asociada con diálisis" },
  { value: "Pie cavo", label: "Pie cavo" },
  { value: "Queratoglobo", label: "Queratoglobo" },
  { value: "Quiste de Baker", label: "Quiste de Baker" },
  { value: "Raíces expuestas", label: "Raíces expuestas" },
  { value: "Ronchas", label: "Ronchas" },
  { value: "Submordida", label: "Submordida" },
  { value: "Síndrome femororrotuliano", label: "Síndrome femororrotuliano" },
  { value: "Tics transitorios", label: "Tics transitorios" },
  { value: "Tiña", label: "Tiña" },
  { value: "Tos crónica", label: "Tos crónica" },
  { value: "Trastorno de la personalidad evasiva", label: "Trastorno de la personalidad evasiva" },
  { value: "Tuberculosis", label: "Tuberculosis" },
  { value: "Vaginitis", label: "Vaginitis" },
  { value: "Verrugas venéreas", label: "Verrugas venéreas" },
  { value: "Absceso cerebral", label: "Absceso cerebral" },
  { value: "Alergia de insectos", label: "Alergia de insectos" },
  { value: "Almorranas", label: "Almorranas" },
  { value: "Aneurisma", label: "Aneurisma" },
  { value: "Artritis bacteriana", label: "Artritis bacteriana" },
  { value: "Asimetría facial", label: "Asimetría facial" },
  { value: "Asma inducido por el ejercicio", label: "Asma inducido por el ejercicio" },
  { value: "Cetoacidosis", label: "Cetoacidosis" },
  { value: "Clamidia", label: "Clamidia" },
  { value: "Codo dislocado en niños", label: "Codo dislocado en niños" },
  { value: "Coroidopatía serosa central", label: "Coroidopatía serosa central" },
  { value: "Cáncer", label: "Cáncer" },
  { value: "Deficiencia de la hormona del crecimiento", label: "Deficiencia de la hormona del crecimiento" },
  { value: "Delirio", label: "Delirio" },
  { value: "Desplazamiento de la cabeza del fémur", label: "Desplazamiento de la cabeza del fémur" },
  { value: "Dolor de dedos", label: "Dolor de dedos" },
  { value: "El tartamudeo y los niños", label: "El tartamudeo y los niños" },
  { value: "Encorvadura de la espalda", label: "Encorvadura de la espalda" },
  { value: "Enfermedad de Legg-Calve-Perthes", label: "Enfermedad de Legg-Calve-Perthes" },
  { value: "Enfermedad vascular periférica", label: "Enfermedad vascular periférica" },
  { value: "Esclerosis lateral amiotrófica", label: "Esclerosis lateral amiotrófica" },
  { value: "Esguinces", label: "Esguinces" },
  { value: "Hepatitis C", label: "Hepatitis C" },
  { value: "Infecciones", label: "Infecciones" },
  { value: "Infecciones de vías urinarias", label: "Infecciones de vías urinarias" },
  { value: "Infecciones por clamidia en mujeres", label: "Infecciones por clamidia en mujeres" },
  { value: "Infección crónica del oído", label: "Infección crónica del oído" },
  { value: "Luxaciones", label: "Luxaciones" },
  { value: "Miastenia grave", label: "Miastenia grave" },
  { value: "Periimplantitis", label: "Periimplantitis" },
  { value: "Próstata agrandada", label: "Próstata agrandada" },
  { value: "Pérdida del cabello en mujeres", label: "Pérdida del cabello en mujeres" },
  { value: "Sangrado anovulatorio", label: "Sangrado anovulatorio" },
  { value: "Sialoadenitis", label: "Sialoadenitis" },
  { value: "Sinusitis crónica", label: "Sinusitis crónica" },
  { value: "Síndrome de Guillain-Barré", label: "Síndrome de Guillain-Barré" },
  { value: "Síndrome del intestino corto", label: "Síndrome del intestino corto" },
  { value: "Tetralogía de Fallot", label: "Tetralogía de Fallot" },
  { value: "Tumor del riñón o Tumor renal", label: "Tumor del riñón o Tumor renal" },
  { value: "Tumor nasal", label: "Tumor nasal" },
  { value: "Abuso de drogas y farmacodependencia", label: "Abuso de drogas y farmacodependencia" },
  { value: "Acrocordones", label: "Acrocordones" },
  { value: "Acromegalia", label: "Acromegalia" },
  { value: "Adenoma hipofisario secretor de prolactina", label: "Adenoma hipofisario secretor de prolactina" },
  { value: "Adherencia intrauterina", label: "Adherencia intrauterina" },
  { value: "Atresia esofágica", label: "Atresia esofágica" },
  { value: "Autismo en mujeres", label: "Autismo en mujeres" },
  { value: "Bocio multinodular tóxico", label: "Bocio multinodular tóxico" },
  { value: "Bursitis epitroclear", label: "Bursitis epitroclear" },
  { value: "Callos y callosidades", label: "Callos y callosidades" },
  { value: "Calvicie de patrón femenino", label: "Calvicie de patrón femenino" },
  { value: "Carcinoma hepatocelular", label: "Carcinoma hepatocelular" },
  { value: "Comunicación interauricular", label: "Comunicación interauricular" },
  { value: "Conducto arterial persistente", label: "Conducto arterial persistente" },
  { value: "Conducto nasolagrimal obstruido", label: "Conducto nasolagrimal obstruido" },
  { value: "Cáncer tiroideo (carcinoma medular)", label: "Cáncer tiroideo (carcinoma medular)" },
  { value: "Daño renal", label: "Daño renal" },
  { value: "Desprendimiento prematuro de placenta", label: "Desprendimiento prematuro de placenta" },
  { value: "Disfunción de la trompa de Eustaquio", label: "Disfunción de la trompa de Eustaquio" },
  { value: "Dolor somático", label: "Dolor somático" },
  { value: "Embarazo tubárico", label: "Embarazo tubárico" },
  { value: "Encopresis", label: "Encopresis" },
  { value: "Enfermedades renales", label: "Enfermedades renales" },
  { value: "Eritema tóxico del neonato", label: "Eritema tóxico del neonato" },
  { value: "Espasticidad", label: "Espasticidad" },
  { value: "Fiebre de origen desconocido", label: "Fiebre de origen desconocido" },
  { value: "Glándula de Bartolino", label: "Glándula de Bartolino" },
  { value: "Hemangioma", label: "Hemangioma" },
  { value: "Hiperplasia suprarrenal congénita", label: "Hiperplasia suprarrenal congénita" },
  { value: "Hipoacusia en bebés", label: "Hipoacusia en bebés" },
  { value: "Hombro doloroso", label: "Hombro doloroso" },
  { value: "Infección vaginal por levaduras", label: "Infección vaginal por levaduras" },
  { value: "Infección vaginal por tricomonas", label: "Infección vaginal por tricomonas" },
  { value: "Infección viral de las vías respiratorias bajas", label: "Infección viral de las vías respiratorias bajas" },
  { value: "Luxación de la cabeza del radio", label: "Luxación de la cabeza del radio" },
  { value: "Mastitis", label: "Mastitis" },
  { value: "Neuropatias Compresivas", label: "Neuropatias Compresivas" },
  { value: "Neuropatía del nervio radial", label: "Neuropatía del nervio radial" },
  { value: "Neuropatía diabética", label: "Neuropatía diabética" },
  { value: "Náuseas persistentes en el embarazo", label: "Náuseas persistentes en el embarazo" },
  { value: "Osteonecrosis", label: "Osteonecrosis" },
  { value: "Osteosarcoma", label: "Osteosarcoma" },
  { value: "Parafimosis", label: "Parafimosis" },
  { value: "Perforación gastrointestinal", label: "Perforación gastrointestinal" },
  { value: "Personalidad psicopática", label: "Personalidad psicopática" },
  { value: "Postura jorobada", label: "Postura jorobada" },
  { value: "Prolapso rectal", label: "Prolapso rectal" },
  { value: "Pérdida gestacional recurrente", label: "Pérdida gestacional recurrente" },
  { value: "Queratoconjuntivitis seca", label: "Queratoconjuntivitis seca" },
  { value: "Quistes ováricos fisiológicos", label: "Quistes ováricos fisiológicos" },
  { value: "Quistes ováricos funcionales", label: "Quistes ováricos funcionales" },
  { value: "Reducción de grasa (adiposidades)", label: "Reducción de grasa (adiposidades)" },
  { value: "Retinopatía de la prematuridad", label: "Retinopatía de la prematuridad" },
  { value: "Retraso del desarrollo", label: "Retraso del desarrollo" },
  { value: "Sinusitis aguda", label: "Sinusitis aguda" },
  { value: "TAG", label: "TAG" },
  { value: "Tartamudeo", label: "Tartamudeo" },
  { value: "Tinnitus", label: "Tinnitus" },
  { value: "Trastorno convulsivo", label: "Trastorno convulsivo" },
  { value: "Trastorno de dolor", label: "Trastorno de dolor" },
  { value: "Tumor hipofisario", label: "Tumor hipofisario" },
  { value: "Uremia", label: "Uremia" },
  { value: "Úlcera duodenal", label: "Úlcera duodenal" },
  { value: "ADHD", label: "ADHD" },
  { value: "Absceso de las amígdalas", label: "Absceso de las amígdalas" },
  { value: "Acalasia esofágica", label: "Acalasia esofágica" },
  { value: "Ano imperforado", label: "Ano imperforado" },
  { value: "Artritis idiopática juvenil", label: "Artritis idiopática juvenil" },
  { value: "Astrocitoma en niños", label: "Astrocitoma en niños" },
  { value: "Atrofia muscular espinal", label: "Atrofia muscular espinal" },
  { value: "Bacteriuria asintomática", label: "Bacteriuria asintomática" },
  { value: "Bursitis retrocalcánea", label: "Bursitis retrocalcánea" },
  { value: "Calvicie de patrón masculino", label: "Calvicie de patrón masculino" },
  { value: "Cifosis", label: "Cifosis" },
  { value: "Colestasis intrahepática", label: "Colestasis intrahepática" },
  { value: "Colon redundante", label: "Colon redundante" },
  { value: "Complicaciones en cirugía laparoscópica", label: "Complicaciones en cirugía laparoscópica" },
  { value: "Cáncer de células transicionales de la pelvis renal o del uréter", label: "Cáncer de células transicionales de la pelvis renal o del uréter" },
  { value: "Cáncer de piel escamocelular", label: "Cáncer de piel escamocelular" },
  { value: "Cáncer del hígado", label: "Cáncer del hígado" },
  { value: "Cáncer: leucemia infantil aguda (LLA)", label: "Cáncer: leucemia infantil aguda (LLA)" },
  { value: "Demencia senil", label: "Demencia senil" },
  { value: "Depresión psicótica", label: "Depresión psicótica" },
  { value: "Derrame subdural", label: "Derrame subdural" },
  { value: "Desviación Septal", label: "Desviación Septal" },
  { value: "Dislocación en el desarrollo de la cadera", label: "Dislocación en el desarrollo de la cadera" },
  { value: "Enfermedad de Hirschsprung", label: "Enfermedad de Hirschsprung" },
  { value: "Enfermedad mano-pie-boca", label: "Enfermedad mano-pie-boca" },
  { value: "Enfermedad trofoblástica gestacional", label: "Enfermedad trofoblástica gestacional" },
  { value: "Enfermedades psicosomáticas de la piel", label: "Enfermedades psicosomáticas de la piel" },
  { value: "Estenosis biliar", label: "Estenosis biliar" },
  { value: "Eyaculación retrasada", label: "Eyaculación retrasada" },
  { value: "Fisura vaginal", label: "Fisura vaginal" },
  { value: "Herpes labial", label: "Herpes labial" },
  { value: "Hipertensión arterial sistémica", label: "Hipertensión arterial sistémica" },
  { value: "Infección del tejido mamario", label: "Infección del tejido mamario" },
  { value: "Infección necrosante de tejidos blandos", label: "Infección necrosante de tejidos blandos" },
  { value: "Insuficiencia respiratoria", label: "Insuficiencia respiratoria" },
  { value: "Isquemia testicular", label: "Isquemia testicular" },
  { value: "Leucemia aguda de la infancia", label: "Leucemia aguda de la infancia" },
  { value: "Malabsorción", label: "Malabsorción" },
  { value: "Malformación anorrectal", label: "Malformación anorrectal" },
  { value: "Meningioma en adultos", label: "Meningioma en adultos" },
  { value: "Miositis", label: "Miositis" },
  { value: "Mutismo selectivo", label: "Mutismo selectivo" },
  { value: "Neumonía nosocomial o intrahospitalaria", label: "Neumonía nosocomial o intrahospitalaria" },
  { value: "Nutrición y salud emocional", label: "Nutrición y salud emocional" },
  { value: "Oclusión de la vena retiniana central", label: "Oclusión de la vena retiniana central" },
  { value: "Opacidad del cristalino", label: "Opacidad del cristalino" },
  { value: "Ovario poliquístico", label: "Ovario poliquístico" },
  { value: "Ovulación dolorosa", label: "Ovulación dolorosa" },
  { value: "Prostatitis aguda", label: "Prostatitis aguda" },
  { value: "Pólipos colorrectales", label: "Pólipos colorrectales" },
  { value: "Púrpura trombocitopénica inmunitaria", label: "Púrpura trombocitopénica inmunitaria" },
  { value: "Queratitis por herpes simple", label: "Queratitis por herpes simple" },
  { value: "Quiste mucoso", label: "Quiste mucoso" },
  { value: "Quistes vaginales", label: "Quistes vaginales" },
  { value: "Síndrome de Asperger", label: "Síndrome de Asperger" },
  { value: "Síndrome de bradicardia-taquicardia", label: "Síndrome de bradicardia-taquicardia" },
  { value: "Síndrome de oclusión de la arteria carótida", label: "Síndrome de oclusión de la arteria carótida" },
  { value: "Síndrome de resistencia a la insulina", label: "Síndrome de resistencia a la insulina" },
  { value: "Taquicardia supraventricular paroxística (TSVP)", label: "Taquicardia supraventricular paroxística (TSVP)" },
  { value: "Tendinitis calcificada", label: "Tendinitis calcificada" },
  { value: "Tiroides", label: "Tiroides" },
  { value: "Trastorno de terror durante el sueño", label: "Trastorno de terror durante el sueño" },
  { value: "Trastorno esquizoafectivo", label: "Trastorno esquizoafectivo" },
  { value: "Tromboflebitis", label: "Tromboflebitis" },
  { value: "Vejiga hiperreactiva", label: "Vejiga hiperreactiva" },
  { value: "Abuso de drogas", label: "Abuso de drogas" },
  { value: "Adenocarcinoma del útero", label: "Adenocarcinoma del útero" },
  { value: "Anomalías congénitas", label: "Anomalías congénitas" },
  { value: "Arcos caídos", label: "Arcos caídos" },
  { value: "Atresia duodenal", label: "Atresia duodenal" },
  { value: "Bronquiectasia", label: "Bronquiectasia" },
  { value: "Brucelosis", label: "Brucelosis" },
  { value: "Carcinoma corticosuprarrenal", label: "Carcinoma corticosuprarrenal" },
  { value: "Carcinoma de células renales", label: "Carcinoma de células renales" },
  { value: "Carcinoma papilar de la tiroides", label: "Carcinoma papilar de la tiroides" },
  { value: "Cardiomiopatía hipertrófica (CMH)", label: "Cardiomiopatía hipertrófica (CMH)" },
  { value: "Celiaquía", label: "Celiaquía" },
  { value: "Celulitis orbitaria", label: "Celulitis orbitaria" },
  { value: "Comunicación interventricular", label: "Comunicación interventricular" },
  { value: "Cáncer de esófago", label: "Cáncer de esófago" },
  { value: "Dengue hemorrágico", label: "Dengue hemorrágico" },
  { value: "Diarrea crónica", label: "Diarrea crónica" },
  { value: "Disfagia", label: "Disfagia" },
  { value: "Dislocación de la cabeza radial", label: "Dislocación de la cabeza radial" },
  { value: "Displasia broncopulmonar", label: "Displasia broncopulmonar" },
  { value: "Distrofia de Fuchs", label: "Distrofia de Fuchs" },
  { value: "Divertículos del colon", label: "Divertículos del colon" },
  { value: "Embolia arterial", label: "Embolia arterial" },
  { value: "Embolia cerebral", label: "Embolia cerebral" },
  { value: "Enfermedad de Peyronie", label: "Enfermedad de Peyronie" },
  { value: "Enfermedades de la glándula mamaria", label: "Enfermedades de la glándula mamaria" },
  { value: "Enfermedades terminales", label: "Enfermedades terminales" },
  { value: "Esguince cervical", label: "Esguince cervical" },
  { value: "Esplenectomía - síndrome posoperatorio", label: "Esplenectomía - síndrome posoperatorio" },
  { value: "Espolón calcáneo y fascitis plantar", label: "Espolón calcáneo y fascitis plantar" },
  { value: "Estenosis de la válvula pulmonar", label: "Estenosis de la válvula pulmonar" },
  { value: "Fiebre tifoidea", label: "Fiebre tifoidea" },
  { value: "Gastrosquisis", label: "Gastrosquisis" },
  { value: "Hematoma subdural crónico", label: "Hematoma subdural crónico" },
  { value: "Hemiplejía", label: "Hemiplejía" },
  { value: "Hepatitis B", label: "Hepatitis B" },
  { value: "Hipotensión", label: "Hipotensión" },
  { value: "Infección de la vagina por levaduras", label: "Infección de la vagina por levaduras" },
  { value: "Infección de las vías urinarias asociada con el uso de catéteres", label: "Infección de las vías urinarias asociada con el uso de catéteres" },
  { value: "Infección de vías urinarias", label: "Infección de vías urinarias" },
  { value: "Infección lingual", label: "Infección lingual" },
  { value: "Infección mamaria", label: "Infección mamaria" },
  { value: "Infección sinusal", label: "Infección sinusal" },
  { value: "Inflamación vaginal", label: "Inflamación vaginal" },
  { value: "Insuficiencia cardíaca congestiva", label: "Insuficiencia cardíaca congestiva" },
  { value: "Insuficiencia ovárica prematura", label: "Insuficiencia ovárica prematura" },
  { value: "Intersexualidad", label: "Intersexualidad" },
  { value: "Leiomioma", label: "Leiomioma" },
  { value: "Lesión renal aguda", label: "Lesión renal aguda" },
  { value: "Leucemia aguda mieloide", label: "Leucemia aguda mieloide" },
  { value: "Leucemia mielógena crónica (LMC)", label: "Leucemia mielógena crónica (LMC)" },
  { value: "Malformación arteriovenosa cerebral", label: "Malformación arteriovenosa cerebral" },
  { value: "Mielomeningocele", label: "Mielomeningocele" },
  { value: "Neuritis óptica", label: "Neuritis óptica" },
  { value: "Obstrucción de la unión ureteropélvica", label: "Obstrucción de la unión ureteropélvica" },
  { value: "Pigmentación severa dental", label: "Pigmentación severa dental" },
  { value: "Pérdida auditiva relacionada con la edad", label: "Pérdida auditiva relacionada con la edad" },
  { value: "Pólipos intestinales", label: "Pólipos intestinales" },
  { value: "Queratitis bacteriana", label: "Queratitis bacteriana" },
  { value: "Reacción alérgica a una droga (medicamento)", label: "Reacción alérgica a una droga (medicamento)" },
  { value: "Riñones poliquísticos", label: "Riñones poliquísticos" },
  { value: "Sangrado nasal", label: "Sangrado nasal" },
  { value: "Shock séptico", label: "Shock séptico" },
  { value: "Soplo cardíaco", label: "Soplo cardíaco" },
  { value: "Síndrome HELLP", label: "Síndrome HELLP" },
  { value: "Síndrome de Cushing", label: "Síndrome de Cushing" },
  { value: "Taquicardia ventricular", label: "Taquicardia ventricular" },
  { value: "Tiña de los pies", label: "Tiña de los pies" },
  { value: "Trastorno de conversión", label: "Trastorno de conversión" },
  { value: "Trastorno de la personalidad esquizoide", label: "Trastorno de la personalidad esquizoide" },
  { value: "Trastorno de pánico", label: "Trastorno de pánico" },
  { value: "Tricotilomanía", label: "Tricotilomanía" },
  { value: "Uretritis", label: "Uretritis" },
  { value: "Verrugas Anales", label: "Verrugas Anales" },
  { value: "Úlcera labial", label: "Úlcera labial" },
  { value: "Accidente cardiovascular", label: "Accidente cardiovascular" },
  { value: "Accidente cerebrovascular cardioembólico", label: "Accidente cerebrovascular cardioembólico" },
  { value: "Accidente cerebrovascular secundario a fibrilación auricular", label: "Accidente cerebrovascular secundario a fibrilación auricular" },
  { value: "Acidosis metabólica", label: "Acidosis metabólica" },
  { value: "Adenoma secretante", label: "Adenoma secretante" },
  { value: "Afecciones asociadas con la ictericia", label: "Afecciones asociadas con la ictericia" },
  { value: "Alcohol en el embarazo", label: "Alcohol en el embarazo" },
  { value: "Amenorrea", label: "Amenorrea" },
  { value: "Aneurisma aórtico", label: "Aneurisma aórtico" },
  { value: "Aneurisma de la aorta torácica", label: "Aneurisma de la aorta torácica" },
  { value: "Apoplejía", label: "Apoplejía" },
  { value: "Arco alto", label: "Arco alto" },
  { value: "Arterioesclerosis de las extremidades", label: "Arterioesclerosis de las extremidades" },
  { value: "Artritis cervical", label: "Artritis cervical" },
  { value: "Asma ocupacional", label: "Asma ocupacional" },
  { value: "Boca de trinchera", label: "Boca de trinchera" },
  { value: "Carcinoma de células transicionales de la vejiga", label: "Carcinoma de células transicionales de la vejiga" },
  { value: "Cardiopatía cianótica", label: "Cardiopatía cianótica" },
  { value: "Celulitis preseptal", label: "Celulitis preseptal" },
  { value: "Cirrosis biliar primaria", label: "Cirrosis biliar primaria" },
  { value: "Cistitis en niños", label: "Cistitis en niños" },
  { value: "Colecistopatía", label: "Colecistopatía" },
  { value: "Colesteatoma", label: "Colesteatoma" },
  { value: "Complicaciones en cirugía de obesidad", label: "Complicaciones en cirugía de obesidad" },
  { value: "Comunicación auriculoventricular", label: "Comunicación auriculoventricular" },
  { value: "Congoja", label: "Congoja" },
  { value: "Convulsión inducida por fiebre", label: "Convulsión inducida por fiebre" },
  { value: "Cáncer de garganta", label: "Cáncer de garganta" },
  { value: "DDC", label: "DDC" },
  { value: "Deslizamiento de la epífisis capital femoral", label: "Deslizamiento de la epífisis capital femoral" },
  { value: "Enfermedad de Graves", label: "Enfermedad de Graves" },
  { value: "Enfermedad glomerular lúpica", label: "Enfermedad glomerular lúpica" },
  { value: "Enfermedad ovárica polifolicular", label: "Enfermedad ovárica polifolicular" },
  { value: "Enfermedades del colon y recto", label: "Enfermedades del colon y recto" },
  { value: "Escleritis", label: "Escleritis" },
  { value: "Espina bífida", label: "Espina bífida" },
  { value: "Espolón calcáneo", label: "Espolón calcáneo" },
  { value: "Estenosis esofágica benigna", label: "Estenosis esofágica benigna" },
  { value: "Estreñimiento en embarazadas", label: "Estreñimiento en embarazadas" },
  { value: "Familia de tumores de Ewing", label: "Familia de tumores de Ewing" },
  { value: "Fascitis necrosante", label: "Fascitis necrosante" },
  { value: "Fibrosis pulmonar idiopática", label: "Fibrosis pulmonar idiopática" },
  { value: "Fotosensibilidad", label: "Fotosensibilidad" },
  { value: "Fístula gastroyeyunocólica", label: "Fístula gastroyeyunocólica" },
  { value: "Glaucoma de ángulo abierto", label: "Glaucoma de ángulo abierto" },
  { value: "Glioma en adultos", label: "Glioma en adultos" },
  { value: "Granulomatosis de Wegener", label: "Granulomatosis de Wegener" },
  { value: "Gripe", label: "Gripe" },
  { value: "Helicobacter pylori", label: "Helicobacter pylori" },
  { value: "Hepatitis autoinmunitaria", label: "Hepatitis autoinmunitaria" },
  { value: "Hipoacusia", label: "Hipoacusia" },
  { value: "Hipogonadismo", label: "Hipogonadismo" },
  { value: "Hiponatremia", label: "Hiponatremia" },
  { value: "Incontinencia fecal", label: "Incontinencia fecal" },
  { value: "Incremento de la presión intracraneal", label: "Incremento de la presión intracraneal" },
  { value: "Infección de los testículos", label: "Infección de los testículos" },
  { value: "Infección del espacio sublingual", label: "Infección del espacio sublingual" },
  { value: "Infección micótica de piel", label: "Infección micótica de piel" },
  { value: "Infección por rotavirus", label: "Infección por rotavirus" },
  { value: "Infección renal", label: "Infección renal" },
  { value: "Infección urinaria complicada", label: "Infección urinaria complicada" },
  { value: "Inflamación de la conjuntiva", label: "Inflamación de la conjuntiva" },
  { value: "Inflamación del cuello uterino", label: "Inflamación del cuello uterino" },
  { value: "Insuficiencia aórtica", label: "Insuficiencia aórtica" },
  { value: "Insuficiencia en el crecimiento", label: "Insuficiencia en el crecimiento" },
  { value: "Insuficiencia placentaria", label: "Insuficiencia placentaria" },
  { value: "Isquemia del colon", label: "Isquemia del colon" },
  { value: "Laringotraqueobronquitis aguda", label: "Laringotraqueobronquitis aguda" },
  { value: "Lengua geográfica", label: "Lengua geográfica" },
  { value: "Lesión de la vejiga y la uretra", label: "Lesión de la vejiga y la uretra" },
  { value: "Malformaciones arteriovenosas", label: "Malformaciones arteriovenosas" },
  { value: "Mano Reumática", label: "Mano Reumática" },
  { value: "Meningitis tuberculosa", label: "Meningitis tuberculosa" },
  { value: "Neumotórax", label: "Neumotórax" },
  { value: "Neuropatía del nervio mediano distal", label: "Neuropatía del nervio mediano distal" },
  { value: "Oclusión de la arteria retiniana central", label: "Oclusión de la arteria retiniana central" },
  { value: "Ojo perezoso", label: "Ojo perezoso" },
  { value: "Osteomielitis", label: "Osteomielitis" },
  { value: "Parálisis espástica", label: "Parálisis espástica" },
  { value: "Pediculosis", label: "Pediculosis" },
  { value: "Peritonitis de tipo secundario", label: "Peritonitis de tipo secundario" },
  { value: "Polidactilia", label: "Polidactilia" },
  { value: "Poliquistosis ovárica", label: "Poliquistosis ovárica" },
  { value: "Prolactinoma", label: "Prolactinoma" },
  { value: "Pronación del pie", label: "Pronación del pie" },
  { value: "Pseudotumor cerebral", label: "Pseudotumor cerebral" },
  { value: "Quiste de retención mucosa", label: "Quiste de retención mucosa" },
  { value: "Quiste poplíteo", label: "Quiste poplíteo" },
  { value: "Retinopatía serosa central", label: "Retinopatía serosa central" },
  { value: "Retraso en el crecimiento intrauterino", label: "Retraso en el crecimiento intrauterino" },
  { value: "Retraso en el desarrollo psicomotor", label: "Retraso en el desarrollo psicomotor" },
  { value: "Rinitis no alérgica", label: "Rinitis no alérgica" },
  { value: "Sarcoma de Ewing", label: "Sarcoma de Ewing" },
  { value: "Sarcoma del tejido blando", label: "Sarcoma del tejido blando" },
  { value: "Sarcopenia", label: "Sarcopenia" },
  { value: "Subluxación de la cabeza del radio", label: "Subluxación de la cabeza del radio" },
  { value: "Sífilis", label: "Sífilis" },
  { value: "Síndrome de sueño y vigilia irregulares", label: "Síndrome de sueño y vigilia irregulares" },
  { value: "Síndrome de transfusión fetal", label: "Síndrome de transfusión fetal" },
  { value: "Talalgia", label: "Talalgia" },
  { value: "Tibia vara", label: "Tibia vara" },
  { value: "Trastorno ciclotímico", label: "Trastorno ciclotímico" },
  { value: "Trastorno de las matemáticas", label: "Trastorno de las matemáticas" },
  { value: "Trastorno del sueño durante el día", label: "Trastorno del sueño durante el día" },
  { value: "Trastorno psicosomático alimenticio", label: "Trastorno psicosomático alimenticio" },
  { value: "Tromboembolia venosa", label: "Tromboembolia venosa" },
  { value: "Tumor cerebral infratentorial", label: "Tumor cerebral infratentorial" },
  { value: "Tumor cerebral metastásico (secundario)", label: "Tumor cerebral metastásico (secundario)" },
  { value: "Tímpano perforado", label: "Tímpano perforado" },
  { value: "Uña del pie encarnada", label: "Uña del pie encarnada" },
  { value: "Viscosuplementacion", label: "Viscosuplementacion" },
  { value: "ACV", label: "ACV" },
  { value: "Absceso del ano y el recto", label: "Absceso del ano y el recto" },
  { value: "Absceso pancreático", label: "Absceso pancreático" },
  { value: "Accidente cerebrovascular secundario a embolia cardiógena", label: "Accidente cerebrovascular secundario a embolia cardiógena" },
  { value: "Amaurosis fugaz", label: "Amaurosis fugaz" },
  { value: "Angiodisplasia del colon", label: "Angiodisplasia del colon" },
  { value: "Anomalía de Ebstein", label: "Anomalía de Ebstein" },
  { value: "Antepié varo", label: "Antepié varo" },
  { value: "Arterioesclerosis", label: "Arterioesclerosis" },
  { value: "Arteriosclerosis", label: "Arteriosclerosis" },
  { value: "Arteritis de Takayasu", label: "Arteritis de Takayasu" },
  { value: "Artritis reactiva", label: "Artritis reactiva" },
  { value: "COVID 19", label: "COVID 19" },
  { value: "Carcinoma escamocelular de la piel", label: "Carcinoma escamocelular de la piel" },
  { value: "Cervicalgía", label: "Cervicalgía" },
  { value: "Citomegalovirus (CMV)", label: "Citomegalovirus (CMV)" },
  { value: "Colitis isquémica", label: "Colitis isquémica" },
  { value: "Colostomia", label: "Colostomia" },
  { value: "Complicaciones en cirugía general", label: "Complicaciones en cirugía general" },
  { value: "Conjuntivitis aguda", label: "Conjuntivitis aguda" },
  { value: "Convulsión generalizada", label: "Convulsión generalizada" },
  { value: "Crisis epiléptica focal", label: "Crisis epiléptica focal" },
  { value: "Cáncer anal", label: "Cáncer anal" },
  { value: "Cáncer de la vulva", label: "Cáncer de la vulva" },
  { value: "Cáncer de paratiroides", label: "Cáncer de paratiroides" },
  { value: "Cáncer de útero", label: "Cáncer de útero" },
  { value: "Cáncer oral", label: "Cáncer oral" },
  { value: "Dedo supernumerario", label: "Dedo supernumerario" },
  { value: "Defecto del canal auriculoventricular", label: "Defecto del canal auriculoventricular" },
  { value: "Defecto septal interventricular", label: "Defecto septal interventricular" },
  { value: "Derrame ocular", label: "Derrame ocular" },
  { value: "Desnutrición infantil", label: "Desnutrición infantil" },
  { value: "Desprendimiento placentario", label: "Desprendimiento placentario" },
  { value: "Disección aórtica", label: "Disección aórtica" },
  { value: "Disfunción placentaria", label: "Disfunción placentaria" },
  { value: "Distrofia corneal", label: "Distrofia corneal" },
  { value: "Diástasis de rectos", label: "Diástasis de rectos" },
  { value: "Dolor de espalda", label: "Dolor de espalda" },
  { value: "Dolor de oído relacionado con la presión", label: "Dolor de oído relacionado con la presión" },
  { value: "Dolor terminal", label: "Dolor terminal" },
  { value: "Dolor torácico pleurítico", label: "Dolor torácico pleurítico" },
  { value: "Endometritis", label: "Endometritis" },
  { value: "Enfermedad de Addison", label: "Enfermedad de Addison" },
  { value: "Enfermedad de Lyme", label: "Enfermedad de Lyme" },
  { value: "Enfermedades del intestino delgado", label: "Enfermedades del intestino delgado" },
  { value: "Epiescleritis", label: "Epiescleritis" },
  { value: "Eritema infeccioso", label: "Eritema infeccioso" },
  { value: "Estenosis meatal uretral", label: "Estenosis meatal uretral" },
  { value: "Estomatitis candidósica", label: "Estomatitis candidósica" },
  { value: "Falla crónica de los riñones", label: "Falla crónica de los riñones" },
  { value: "Foliculitis", label: "Foliculitis" },
  { value: "Fístula pre-auricular", label: "Fístula pre-auricular" },
  { value: "Fístula traqueoesofágica", label: "Fístula traqueoesofágica" },
  { value: "Gastroparesia", label: "Gastroparesia" },
  { value: "Glaucoma congénito", label: "Glaucoma congénito" },
  { value: "HIV/SIDA", label: "HIV/SIDA" },
  { value: "Hernia discales", label: "Hernia discales" },
  { value: "Hipertensión arterial en bebés", label: "Hipertensión arterial en bebés" },
  { value: "Hipertensión renal", label: "Hipertensión renal" },
  { value: "Hipertensión renovascular", label: "Hipertensión renovascular" },
  { value: "Ileostomia", label: "Ileostomia" },
  { value: "Incapacidad para concebir", label: "Incapacidad para concebir" },
  { value: "Infección aguda por VIH", label: "Infección aguda por VIH" },
  { value: "Infección del Tracto Urinario (ITU)", label: "Infección del Tracto Urinario (ITU)" },
  { value: "Infección micótica de la uña", label: "Infección micótica de la uña" },
  { value: "Infección por VIH", label: "Infección por VIH" },
  { value: "Infección urinaria asociada al uso de catéteres", label: "Infección urinaria asociada al uso de catéteres" },
  { value: "Infección viral de las vías respiratorias altas", label: "Infección viral de las vías respiratorias altas" },
  { value: "Inflamación discal", label: "Inflamación discal" },
  { value: "Insuficiencia renal terminal", label: "Insuficiencia renal terminal" },
  { value: "Intoxicación alimentaria", label: "Intoxicación alimentaria" },
  { value: "Lesión maxilofacial", label: "Lesión maxilofacial" },
  { value: "Linfoma de las células B", label: "Linfoma de las células B" },
  { value: "Liquen plano", label: "Liquen plano" },
  { value: "Llagas orales (cáncrum oris)", label: "Llagas orales (cáncrum oris)" },
  { value: "Malformaciones craneofaciales", label: "Malformaciones craneofaciales" },
  { value: "Metatarso aducido", label: "Metatarso aducido" },
  { value: "Neuralgia", label: "Neuralgia" },
  { value: "Neuralgia del trigémino", label: "Neuralgia del trigémino" },
  { value: "Obesidad infantil", label: "Obesidad infantil" },
  { value: "Osteoporosis por Climaterio", label: "Osteoporosis por Climaterio" },
  { value: "Otitis media adhesiva", label: "Otitis media adhesiva" },
  { value: "Perforación de la membrana timpánica", label: "Perforación de la membrana timpánica" },
  { value: "Perlas de Epstein", label: "Perlas de Epstein" },
  { value: "Polineuropatía sensitivomotora", label: "Polineuropatía sensitivomotora" },
  { value: "Prediabetes", label: "Prediabetes" },
  { value: "Presbiacusia", label: "Presbiacusia" },
  { value: "Pubertad precoz", label: "Pubertad precoz" },
  { value: "Relajación pélvica", label: "Relajación pélvica" },
  { value: "Sindactilia", label: "Sindactilia" },
  { value: "Síndrome de Barrett", label: "Síndrome de Barrett" },
  { value: "Síndrome de Williams", label: "Síndrome de Williams" },
  { value: "Síndrome de carencia materna", label: "Síndrome de carencia materna" },
  { value: "Síndrome de distrofia simpática refleja", label: "Síndrome de distrofia simpática refleja" },
  { value: "Talasemia", label: "Talasemia" },
  { value: "Torsión testicular", label: "Torsión testicular" },
  { value: "Trastornos hemorrágicos", label: "Trastornos hemorrágicos" },
  { value: "Tumor de células gigantes", label: "Tumor de células gigantes" },
  { value: "Tumor endocrino pancreático", label: "Tumor endocrino pancreático" },
  { value: "Tumor medular", label: "Tumor medular" },
  { value: "Tumor suprarrenal", label: "Tumor suprarrenal" },
  { value: "Tumor testicular", label: "Tumor testicular" },
  { value: "Varicosidad", label: "Varicosidad" },
  { value: "Vitreoretinopatía proliferativa", label: "Vitreoretinopatía proliferativa" },
  { value: "Várices esofágicas sangrantes", label: "Várices esofágicas sangrantes" },
  { value: "Íleo del colon", label: "Íleo del colon" }
]

 // ---------------------- Filter Logic ----------------------
  const filteredCities = useMemo(() => {
    if (!cityQuery) return []
    const q = normalize(cityQuery)
    return ciudades.filter((c) => {
      if (normalize(c.label).includes(q)) return true
      return !!c.synonyms?.some((syn) => normalize(syn).includes(q))
    })
  }, [cityQuery])

  const filteredOptions = useMemo(() => {
    if (!optionQuery) return []
    const list =
      searchBy === "especialidad"
        ? allEspecialidades
        : allPadecimientos
    const q = normalize(optionQuery)
    return list.filter((opt) => normalize(opt.label).includes(q))
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
        {/* Ciudad Combobox */}
        <div className="w-full md:w-1/3" ref={cityRef}>
          <label htmlFor="city" className="block text-sm font-medium mb-1 text-foreground">
            Buscar en
          </label>
          <div className="relative">
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
                border-input
                bg-background
                px-3
                py-2
                text-sm
                text-foreground
                placeholder:text-muted-foreground
                focus:outline-none
                focus:ring-2
                focus:ring-ring
                focus:ring-offset-2
                ring-offset-background
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              ref={cityInputRef}
            />

            {cityDropdownOpen && cityQuery.length > 0 && (
              <ul className="
                absolute
                z-10
                mt-1
                max-h-60
                w-full
                overflow-auto
                rounded-md
                bg-background
                shadow-lg
                ring-1
                ring-border
                ring-opacity-10
              ">
                {filteredCities.length > 0 ? (
                  filteredCities.map((c) => (
                    <li
                      key={c.value}
                      onClick={() => {
                        setSelectedCity(c)
                        setCityQuery(c.label)
                        setCityDropdownOpen(false)
                        setSelectedOption(null)
                        setOptionQuery("")
                      }}
                      className="
                        cursor-pointer
                        px-3
                        py-2
                        text-sm
                        text-foreground
                        hover:bg-accent
                        hover:text-accent-foreground
                      "
                    >
                      {c.label}
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-sm text-muted-foreground">
                    No hay coincidencias
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Buscar por Selector */}
        {selectedCity && (
          <div className="w-full md:w-1/3">
            <label
              htmlFor="search-by"
              className="block text-sm font-medium mb-1 text-foreground"
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

        {/* Especialidad/Padecimiento Combobox */}
        {selectedCity && (
          <div className="w-full md:w-1/3" ref={optionRef}>
            <label
              htmlFor="search-value"
              className="block text-sm font-medium mb-1 text-foreground"
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
                  border-input
                  bg-background
                  px-3
                  py-2
                  text-sm
                  text-foreground
                  placeholder:text-muted-foreground
                  focus:outline-none
                  focus:ring-2
                  focus:ring-ring
                  focus:ring-offset-2
                  ring-offset-background
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                ref={optionInputRef}
              />

              {optionDropdownOpen && optionQuery.length > 0 && (
                <ul className="
                  absolute
                  z-10
                  mt-1
                  max-h-60
                  w-full
                  overflow-auto
                  rounded-md
                  bg-background
                  shadow-lg
                  ring-1
                  ring-border
                  ring-opacity-10
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
                          py-2
                          text-sm
                          text-foreground
                          hover:bg-accent
                          hover:text-accent-foreground
                        "
                      >
                        {opt.label}
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-sm text-muted-foreground">
                      No hay coincidencias
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Botón Buscar */}
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
