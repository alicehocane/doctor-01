use client"

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
  // City combobox
  const [cityQuery, setCityQuery] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<ComboboxItem | null>(null)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)

  // Search-by (Especialidad | Padecimiento)
  const [searchBy, setSearchBy] = useState<"especialidad" | "padecimiento">(
    "especialidad"
  )

  // Option combobox (Especialidad or Padecimiento)
  const [optionQuery, setOptionQuery] = useState<string>("")
  const [selectedOption, setSelectedOption] = useState<ComboboxItem | null>(
    null
  )
  const [optionDropdownOpen, setOptionDropdownOpen] = useState(false)

  // Final search button loading
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
  { value: "Íleo del colon", label: "Íleo del colon" },

    // "Aborto electivo o terapéutico",  // 6
    // "Abrupción placentaria",  // 6
    // "Absceso de la piel",  // 6
    // "Absceso en el SNC",  // 6
    // "Acidosis tubular renal proximal",  // 6
    // "Acidosis tubular renal tipo I",  // 6
    // "Adherencia pélvica",  // 6
    // "Agorafobia",  // 6
    // "Agua en el pulmón",  // 6
    // "Alteraciones de la voz (disfonía)",  // 6
    // "Amebiasis",  // 6
    // "Artritis gotosa crónica",  // 6
    // "Ausencia congénita de la válvula pulmonar",  // 6
    // "Ausencias típicas",  // 6
    // "Bebé de madre diabética",  // 6
    // "Candidiasis oral (Algodoncillo)",  // 6
    // "Carcinoma medular de tiroides",  // 6
    // "Cardiomiopatía alcohólica",  // 6
    // "Celulitis estreptocócica perianal",  // 6
    // "Chancroide",  // 6
    // "Colitis necrosante",  // 6
    // "Conjuntivitis del neonato",  // 6
    // "Conjuntivitis primaveral",  // 6
    // "Crecimiento Prostático (Hiperplasia Prostática Benigna)",  // 6
    // "Criptodoncia",  // 6
    // "Cuerpos extraños en nariz u oído",  // 6
    // "Cálculos vesicales",  // 6
    // "Cáncer bucal",  // 6
    // "Cáncer de pulmón de células no pequeñas",  // 6
    // "Cáncer de vulva",  // 6
    // "Cáncer no Hodgkin",  // 6
    // "Depresión alucinatoria",  // 6
    // "Depresión unipolar",  // 6
    // "Desgaste articular",  // 6
    // "Desplazamiento de la epífisis femoral",  // 6
    // "Dilatación tóxica del colon",  // 6
    // "Distrofia muscular",  // 6
    // "Dolor reumatico de articulaciones",  // 6
    // "ECN",  // 6
    // "Endoftalmitis",  // 6
    // "Enfermedad de Scheuermann",  // 6
    // "Enfermedad del sueño",  // 6
    // "Enfermedad pulmonar parenquimatosa difusa",  // 6
    // "Enfermedad reactiva de las vías respiratorias inducida por irritantes",  // 6
    // "Entropión",  // 6
    // "Epistaxis",  // 6
    // "Escarlatina",  // 6
    // "Esquizofrenia desorganizada",  // 6
    // "Estapedectomía",  // 6
    // "Estoma Intestinal",  // 6
    // "Estomatitis gangrenosa",  // 6
    // "Faringitis viral",  // 6
    // "Fibromiositis",  // 6
    // "Fiebre recurrente",  // 6
    // "Fracturas de la órbita",  // 6
    // "GERD",  // 6
    // "Glaucoma de ángulo cerrado",  // 6
    // "Glomeruloesclerosis diabética",  // 6
    // "Gota crónica",  // 6
    // "HPB",  // 6
    // "Hemorragia subaracnoidea",  // 6
    // "Hemotórax",  // 6
    // "Hepatitis A",  // 6
    // "Herpangina",  // 6
    // "Hidradenitis supurativa",  // 6
    // "Hipercalcemia",  // 6
    // "Hipertrofia de cornetes",  // 6
    // "Hipoglucemia",  // 6
    // "Hipotiroidismo congénito",  // 6
    // "Hongos en la piel",  // 6
    // "Infección de la piel por bacterias",  // 6
    // "Infección del espacio submandibular",  // 6
    // "Infección urinaria baja",  // 6
    // "Inflamación de la vaina del tendón",  // 6
    // "Inflamación de las articulaciones",  // 6
    // "Isquemia intestinal",  // 6
    // "Lesion de Nervios Perifericos",  // 6
    // "Lesión renal",  // 6
    // "Leucemia crónica granulocítica",  // 6
    // "Micosis",  // 6
    // "Mielofibrosis",  // 6
    // "Miocardiopatía hipertrófica",  // 6
    // "Miocardiopatía isquémica",  // 6
    // "Miocarditis pediátrica",  // 6
    // "Mononucleosis",  // 6
    // "Neumonía por citomegalovirus",  // 6
    // "Neuropatía del nervio cubital",  // 6
    // "Obesidad en el embarazo",  // 6
    // "Obstrucción de la salida de la vejiga",  // 6
    // "Onfalocele",  // 6
    // "Orquitis",  // 6
    // "Osteopenia de la prematuridad",  // 6
    // "Otitis externa aguda",  // 6
    // "Otitis media aguda",  // 6
    // "Parálisis de Erb-Duchenne",  // 6
    // "Parálisis de las cuerdas vocales",  // 6
    // "Persistencia del agujero oval",  // 6
    // "Placenta previa",  // 6
    // "Polaquiuria",  // 6
    // "Policitemia primaria",  // 6
    // "Polimialgia reumática",  // 6
    // "Polineuropatía desmielinizante inflamatoria crónica",  // 6
    // "Posmenopausia",  // 6
    // "Potasio elevado",  // 6
    // "Prolapso de la válvula mitral",  // 6
    // "Prostatitis bacteriana crónica",  // 6
    // "Prostatitis crónica",  // 6
    // "Protuberancia en el párpado",  // 6
    // "Ptosis",  // 6
    // "Queratosis del fumador",  // 6
    // "Queratosis seborreica",  // 6
    // "Rectorragia",  // 6
    // "Retinopatía hipertensiva",  // 6
    // "Ritmos cardíacos anormales",  // 6
    // "Rítides facial",  // 6
    // "Sarampión",  // 6
    // "Sarcoma de partes blandas",  // 6
    // "Síndrome de Ogilvie",  // 6
    // "Síndrome de dolor regional complejo",  // 6
    // "Síndrome nefrítico agudo",  // 6
    // "TMD",  // 6
    // "Taquicardia supraventricular",  // 6
    // "Temblor",  // 6
    // "Terapia narrativa feminista",  // 6
    // "Torsión testicular (Escroto Agudo)",  // 6
    // "Tortícolis",  // 6
    // "Tos ferina",  // 6
    // "Transposición de las grandes arterias",  // 6
    // "Trastorno de dolor somatomorfo",  // 6
    // "Trastorno disfórico premenstrual (TDPM)",  // 6
    // "Trastornos renales y urológicos",  // 6
    // "Trauma acústico",  // 6
    // "Trombocitosis esencial",  // 6
    // "Tromboembolia",  // 6
    // "Tumor de Wilms",  // 6
    // "Tumor vaginal",  // 6
    // "Vaginismo",  // 6
    // "Vejiga caída",  // 6
    // "Venas varicosas en el escroto",  // 6
    // "Verrugas Genitales (Virus del Papiloma Humano)",  // 6
    // "Vesícula",  // 6
    // "Virus sincicial respiratorio (VSR)",  // 6
    // "Aborto séptico",  // 5
    // "Aborto terapéutico",  // 5
    // "Absceso",  // 5
    // "Acidosis tubular distal renal",  // 5
    // "Adenocarcinoma del estómago",  // 5
    // "Adenoma hepático",  // 5
    // "Adenoma paratiroideo",  // 5
    // "Adicción a la pornografía",  // 5
    // "Alopecia universal",  // 5
    // "Anemia de Fanconi",  // 5
    // "Anemia por deficiencia de hierro",  // 5
    // "Aneurisma aórtico disecante",  // 5
    // "Angina de Prinzmetal",  // 5
    // "Angina de aparición reciente",  // 5
    // "Angina pectoral",  // 5
    // "Anillo vascular",  // 5
    // "Apnea en recién nacidos",  // 5
    // "Apoplejía hipofisaria",  // 5
    // "Arteriopatía coronaria (CAD)",  // 5
    // "Arteriopatía periférica",  // 5
    // "Arteritis de células gigantes",  // 5
    // "Barotrauma del oído",  // 5
    // "Bloqueo de la unión ureteropélvica",  // 5
    // "Calambres",  // 5
    // "Carcinoma primario de las células del hígado",  // 5
    // "Cefalea de origen cervical",  // 5
    // "Celulitis periorbitaria",  // 5
    // "Cistitis intersticial",  // 5
    // "Colestasis extrahepática",  // 5
    // "Colitits ulcerativa",  // 5
    // "Control del niño sano",  // 5
    // "Convulsión parcial (focal)",  // 5
    // "Cáncer en el aparato reproductor masculino: Testículo, Pene",  // 5
    // "Cáncer testicular no seminoma",  // 5
    // "Cáncer testicular seminoma",  // 5
    // "Cáncer vaginal",  // 5
    // "Dacriostenosis",  // 5
    // "Deficiencia gonadal",  // 5
    // "Dermatología para Lupus",  // 5
    // "Diabetes insípida central",  // 5
    // "Diabetes mellitus tipo 1 y tipo 2 en niños, adolescentes y adultos",  // 5
    // "Diplopía (visión doble)",  // 5
    // "Dolor crónico",  // 5
    // "Dolor de nervio o dolor nervioso",  // 5
    // "Dolor de pies",  // 5
    // "Dolor lumbar inespecífico",  // 5
    // "Dolor mixto",  // 5
    // "Elevación de potasio",  // 5
    // "Encefalitis",  // 5
    // "Enfermedad cardíaca arterioesclerótica",  // 5
    // "Enfermedad de Perthes",  // 5
    // "Enfermedad diverticular",  // 5
    // "Enfermedad obstructiva crónica de las vías respiratorias",  // 5
    // "Enterocolitis necrosante",  // 5
    // "Epididimitis",  // 5
    // "Esclerosis tuberosa",  // 5
    // "Esferocitosis",  // 5
    // "Espasmo muscular",  // 5
    // "Estomatitis ulcerativa",  // 5
    // "Faringitis gonocócica",  // 5
    // "Fibromioma",  // 5
    // "Fibrosis quística",  // 5
    // "Fractura de Columna",  // 5
    // "Gastritis por Helicobacter pylori",  // 5
    // "Gastroparesia del diabético",  // 5
    // "Gonartrosis",  // 5
    // "Hematoma vesical",  // 5
    // "Hernia del piso pélvico",  // 5
    // "Hifema",  // 5
    // "Hiperbilirrubinemia neonatal",  // 5
    // "Hipercalciemia relacionada con las paratiroides",  // 5
    // "Hiperlordosis",  // 5
    // "Hiperparatiroidismo primario",  // 5
    // "Hipogonadismo primario en hombres",  // 5
    // "Infección de los ganglios linfáticos",  // 5
    // "Infección no complicada de las vías urinarias",  // 5
    // "Infección por VIH asintomática",  // 5
    // "Inflamación cervical",  // 5
    // "Isquemia e infarto intestinal",  // 5
    // "LLC",  // 5
    // "Lesion de Plexo Braquial",  // 5
    // "Lesiones de Lefort",  // 5
    // "Lesión ureteral",  // 5
    // "Linfoma de Burkitt",  // 5
    // "Lipomas",  // 5
    // "Litiasis (Piedras) en la Vía Urinaria: Riñón, Uréter, Vejiga",  // 5
    // "Marcas en la piel",  // 5
    // "Megacolon tóxico",  // 5
    // "Mielofibrosis primaria",  // 5
    // "Miocardiopatía del periparto",  // 5
    // "Miocarditis",  // 5
    // "Mioclono palatino",  // 5
    // "Necrosis intestinal",  // 5
    // "Neoplasia intraepitelial cervical",  // 5
    // "Nervio ciático",  // 5
    // "Neumonía asociada con el uso de un respirador",  // 5
    // "Obstrucción ureteral crónica",  // 5
    // "Oclusión de la ramificación de la arteria retiniana",  // 5
    // "Oclusión de la ramificación de la vena retiniana",  // 5
    // "Osteocondrosis",  // 5
    // "Otitis media crónica",  // 5
    // "Otosclerosis",  // 5
    // "Pancreatitis crónica",  // 5
    // "Parálisis del nervio cubital",  // 5
    // "Pie de atleta",  // 5
    // "Piernas en O",  // 5
    // "Potasio bajo en la sangre",  // 5
    // "Problemas del pezón",  // 5
    // "Pénfigo vulgar",  // 5
    // "Pérdida de memoria",  // 5
    // "Pérdida del cabello en hombres",  // 5
    // "Púrpura de Henoch-Schoenlein",  // 5
    // "Púrpura vascular",  // 5
    // "Queratitis micótica",  // 5
    // "Queratosis actínica solar",  // 5
    // "Rinitis vasomotora",  // 5
    // "SDRA",  // 5
    // "Sangrado por deficiencia de vitamina K",  // 5
    // "Sialolitiasis",  // 5
    // "Sinovitis villonodular",  // 5
    // "Síndrome VKH",  // 5
    // "Síndrome de Parkinson plus",  // 5
    // "Síndrome de Wolff-Parkinson-White",  // 5
    // "Síndrome de dolor pélvico",  // 5
    // "Síndrome de hiperestimulación ovárica",  // 5
    // "Síndrome de transfusión entre gemelos",  // 5
    // "Telangiectasia",  // 5
    // "Tiroiditis de Hashimoto",  // 5
    // "Trastorno de tic transitorio",  // 5
    // "Trastorno mieloproliferativo",  // 5
    // "Trastornos del sueño (insomnio)",  // 5
    // "Tricomoniasis",  // 5
    // "Trombosis",  // 5
    // "Tumor de la glándula lagrimal",  // 5
    // "Tumor del hígado",  // 5
    // "Tumor del ángulo pontocerebeloso",  // 5
    // "Tumor maligno",  // 5
    // "Tumor ocular",  // 5
    // "Tumor pituitario (tumor de la hipófisis)",  // 5
    // "Tumores de las glándulas salivales",  // 5
    // "Vaginitis atrófica",  // 5
    // "Vejiga irritable",  // 5
    // "Vejiga neurógena",  // 5
    // "Verruga vulgar",  // 5
    // "Verrugas filiformes",  // 5
    // "Virus del Zika",  // 5
    // "Épulis",  // 5
    // "Úlceras por presión",  // 5
    // "ANEMIA",  // 4
    // "Aborto consumado",  // 4
    // "Absceso de la médula espinal",  // 4
    // "Absceso en la glándula areolar",  // 4
    // "Absceso rectal",  // 4
    // "Acidosis respiratoria",  // 4
    // "Acidosis tubular renal tipo II",  // 4
    // "Acné quístico",  // 4
    // "Adenocarcinoma de las células renales",  // 4
    // "Adénoma de hipofisis",  // 4
    // "Aftas",  // 4
    // "Algodistrofia del miembro superior",  // 4
    // "Amebiasis hepática",  // 4
    // "Amilidosis cardíaca primaria de tipo AL",  // 4
    // "Andropausia",  // 4
    // "Anemia aplásica secundaria",  // 4
    // "Anemia por deficiencia de vitamina B12",  // 4
    // "Anemia por enfermedad crónica",  // 4
    // "Angina progresiva",  // 4
    // "Angioedema",  // 4
    // "Anquiloglosia",  // 4
    // "Artritis granulomatosa",  // 4
    // "Atresia anal",  // 4
    // "Atrofia de Sudeck",  // 4
    // "BRAO",  // 4
    // "BRVO",  // 4
    // "Bacteriemia meningocócica",  // 4
    // "Blefaroespasmo",  // 4
    // "Bronquitis aguda",  // 4
    // "Carcinoma",  // 4
    // "Carcinoma broncopulmonar",  // 4
    // "Carcinoma ductal o canalicular",  // 4
    // "Carcinoma paratiroideo",  // 4
    // "Causalgia",  // 4
    // "Celotipia",  // 4
    // "Cierre prematuro de las suturas",  // 4
    // "Coagulopatía de consumo",  // 4
    // "Coccidioidomicosis",  // 4
    // "Colestasis",  // 4
    // "Colitis funcional",  // 4
    // "Columna Degenerativa",  // 4
    // "Coma diabético hiperosmolar hiperglucémico",  // 4
    // "Condrosarcoma",  // 4
    // "Contracción del ojo",  // 4
    // "Contractura isquémica",  // 4
    // "Convulsión tónico-clónica",  // 4
    // "Coriorretinitis",  // 4
    // "Craneoplastía",  // 4
    // "Crisis de angustia",  // 4
    // "Cáncer  cabeza y cuello",  // 4
    // "Cáncer  cervix",  // 4
    // "Cáncer  endometrio",  // 4
    // "Cáncer  esófago",  // 4
    // "Cáncer  linfomas",  // 4
    // "Cáncer  recto",  // 4
    // "Cáncer de células escamosas de la piel",  // 4
    // "Cáncer de las cuerdas vocales",  // 4
    // "Cáncer de las vías biliares",  // 4
    // "Cáncer de ojo",  // 4
    // "Cáncer de orofaringe",  // 4
    // "Cáncer de pulmón de células pequeñas",  // 4
    // "Cáncer estomago",  // 4
    // "Cáncer próstata",  // 4
    // "Defecto del tabique auricular (ASD)",  // 4
    // "Defecto del tabique ventricular",  // 4
    // "Deficiencia articulatoria",  // 4
    // "Deficiencia de G-6-PD",  // 4
    // "Deformidad rinoseptal",  // 4
    // "Deformidades de columna",  // 4
    // "Degeneración marginal pelúcida",  // 4
    // "Derrame pleural tuberculoso",  // 4
    // "Derrame pulmonar paraneumónico",  // 4
    // "Desequilibrio de líquidos",  // 4
    // "Diabetes insípida nefrogénica",  // 4
    // "Diabetólogo",  // 4
    // "Diarrea aguda con deshidratación",  // 4
    // "Diarrea inducida por medicamentos",  // 4
    // "Displasia mamaria",  // 4
    // "Distrofia muscular de Duchenne",  // 4
    // "Distrofias coroidales",  // 4
    // "Disuria",  // 4
    // "ELA",  // 4
    // "Eccema infantil",  // 4
    // "Embarazo cervical",  // 4
    // "Encefalopatía hipóxica",  // 4
    // "Encondromatosis múltiple",  // 4
    // "Endocarditis infecciosa",  // 4
    // "Enfermedad CPPD",  // 4
    // "Enfermedad de Blount",  // 4
    // "Enfermedad de Lyme crónica y persistente",  // 4
    // "Enfermedad de Lyme persistente y tardía",  // 4
    // "Enfermedad de Still del adulto",  // 4
    // "Enfermedad de las arterias coronarias o coronariopatía",  // 4
    // "Enfermedad de los huesos frágiles",  // 4
    // "Enfermedad del esófago",  // 4
    // "Enfermedad del quiste hidatídico",  // 4
    // "Enfermedad hemolítica del recién nacido",  // 4
    // "Enfermedad pulmonar intersticial difusa",  // 4
    // "Enfermedades autoinmunes",  // 4
    // "Enfermedades de próstata",  // 4
    // "Enfisema pulmonar",  // 4
    // "Epispadias",  // 4
    // "Erisipela",  // 4
    // "Esclerosis sistémica progresiva",  // 4
    // "Espasmo hemifacial",  // 4
    // "Estenosis de la Unión Ureteropiélica (Estenosis de la UUP)",  // 4
    // "Estomatitis de Vincent",  // 4
    // "Exploración de vías biliares",  // 4
    // "Eyaculación retrógrada",  // 4
    // "FARINGOAMIGDALITIS AGUDA",  // 4
    // "Feocromocitoma",  // 4
    // "Fiebre de Malta",  // 4
    // "Fistula anal",  // 4
    // "Gastritis aguda",  // 4
    // "Gastroenteritis bacteriana",  // 4
    // "Glaucoma crónico",  // 4
    // "Hematoma extradural",  // 4
    // "Hemorragia hipertensiva",  // 4
    // "Hepatitis viral",  // 4
    // "Hidrocefalia comunicante",  // 4
    // "Hidrocefalia en adultos",  // 4
    // "Hidronefrosis bilateral",  // 4
    // "Higroma quístico",  // 4
    // "Hiperglucemia",  // 4
    // "Hiperparatiroidismo secundario",  // 4
    // "Hipertensión acelerada",  // 4
    // "Hipertensión arterial pulmonar",  // 4
    // "Hipertensión portal",  // 4
    // "Hipocaliemia",  // 4
    // "Hipotensión ortostática",  // 4
    // "Hipotensión ortostática neurológica",  // 4
    // "Histiocitosis de las células de Langerhans",  // 4
    // "Infección aguda en el oído externo",  // 4
    // "Infección de la ingle por hongos",  // 4
    // "Infección de la piel por hongos levaduriformes",  // 4
    // "Infección del pie por hongos",  // 4
    // "Insuficiencia mitral aguda",  // 4
    // "Insuficiencia tricuspídea",  // 4
    // "Lesión de conductos biliares",  // 4
    // "Lesión medular",  // 4
    // "Lesión pulmonar aguda",  // 4
    // "Lesión traumática de la vejiga y la uretra",  // 4
    // "Linfadenopatía",  // 4
    // "Linfoma de alto grado de células B",  // 4
    // "Linfoma linfoblástico",  // 4
    // "Liquen simple crónico",  // 4
    // "Mastopatia fibroquística",  // 4
    // "Miocardiopatía dilatada",  // 4
    // "Nariz Torcida",  // 4
    // "Necrosis ósea isquémica",  // 4
    // "Neumonía atípica",  // 4
    // "Neumonía por Legionela",  // 4
    // "Neumonía por aspiración",  // 4
    // "Neumonía viral",  // 4
    // "Neuralgia glosofaríngea",  // 4
    // "Neuronitis vestibular",  // 4
    // "Neuropatía (Diabética,Herpes y Zoster)",  // 4
    // "Neuropatía aislada",  // 4
    // "Neuropatía periférica",  // 4
    // "Neuropatías metabólicas",  // 4
    // "Noma",  // 4
    // "Obstrucción nasal",  // 4
    // "Obstrucción uretral",  // 4
    // "Oclusión de las arterias retinianas",  // 4
    // "Osteogénesis imperfecta",  // 4
    // "Otitis externa crónica",  // 4
    // "Oído de nadador",  // 4
    // "Parasitosis",  // 4
    // "Parálisis del VII par craneal debido a un traumatismo al nacer",  // 4
    // "Parálisis ocular por lesión del nervio motor ocular externo",  // 4
    // "Parálisis progresiva supranuclear",  // 4
    // "Patologías del crecimiento",  // 4
    // "Perforación o ruptura del tímpano",  // 4
    // "Periostitis",  // 4
    // "Pinguécula",  // 4
    // "Poliarteritis nodosa",  // 4
    // "Poliquistosis renal",  // 4
    // "Puerperio",  // 4
    // "Pérdida de potasio",  // 4
    // "Queratitis seca",  // 4
    // "Quiste branquiógeno",  // 4
    // "Quiste queratínico",  // 4
    // "Rabdomiosarcoma",  // 4
    // "Rabdomiosarcoma embrionario",  // 4
    // "Retención aguda de orina (RAO)",  // 4
    // "Retinitis pigmentaria",  // 4
    // "Retinoblastoma",  // 4
    // "Rinitis idiopática",  // 4
    // "Roséola",  // 4
    // "Salpingitis",  // 4
    // "Salpingo peritonitis",  // 4
    // "Sepsis",  // 4
    // "Seudoobstrucción intestinal",  // 4
    // "Shock cardiógeno",  // 4
    // "Sinusitis aguda o cronica",  // 4
    // "Sonambulismo",  // 4
    // "Síndrome de Apert",  // 4
    // "Síndrome de Down",  // 4
    // "Síndrome de apnea obstructiva del sueño (SAOS)",  // 4
    // "Síndrome de disfunción sinusal o disfunción del nódulo sinusal",  // 4
    // "Síndrome de fatiga crónica",  // 4
    // "Síndrome inflamatorio orbital idiopático (IOIS, por sus siglas en inglés)",  // 4
    // "Síndrome renal pulmonar",  // 4
    // "Taponamiento cardíaco",  // 4
    // "Taquicardia auricular multifocal",  // 4
    // "Temblor esencial",  // 4
    // "Teratoma: tumor de células germinales no seminomatosas",  // 4
    // "Transtornos de las suprarrenales",  // 4
    // "Traqueítis",  // 4
    // "Trastorno de conducta del sueño en fase REM",  // 4
    // "Trastorno del desarrollo del lenguaje expresivo",  // 4
    // "Trastorno esquizotípico de la personalidad",  // 4
    // "Trastornos de lenguaje",  // 4
    // "Traumatismo Craneoencefálico y sus Complicaciones",  // 4
    // "Trombosis venosa mesentérica",  // 4
    // "Tumor de columna",  // 4
    // "Tumores cardíacos",  // 4
    // "Tumores de la Columna y Médula Espinal",  // 4
    // "Ureterocele",  // 4
    // "Uretritis masculina por clamidia",  // 4
    // "Uvulitis",  // 4
    // "Uña enterrada",  // 4
    // "Varices",  // 4
    // "Verrugas periungueales",  // 4
    // "Vómito persistente",  // 4
    // "Íleo",  // 4
    // "Íleo colónico agudo",  // 4
    // "ADD",  // 3
    // "AF",  // 3
    // "AMD",  // 3
    // "Ablación de la placenta",  // 3
    // "Absceso alrededor del riñón (perinéfrico)",  // 3
    // "Acantosis pigmentaria",  // 3
    // "Accidente cerebrovascular secundario a disección carotídea",  // 3
    // "Accidente isquémico transitorio (AIT)",  // 3
    // "Acidosis",  // 3
    // "Acromatopsia",  // 3
    // "Adenoma hipofisiario",  // 3
    // "Adenoma sebáceo",  // 3
    // "Adenovirus",  // 3
    // "Albinismo oculocutáneo",  // 3
    // "Alergia a la proteína de la leche de vaca",  // 3
    // "Alteraciones hormonales",  // 3
    // "Amilidosis cardíaca secundaria de tipo AA",  // 3
    // "Amiloidosis",  // 3
    // "Anemia drepanocítica",  // 3
    // "Anemia hemolítica causada por químicos o toxinas",  // 3
    // "Anemia macrocítica",  // 3
    // "Anemia megaloblástica",  // 3
    // "Anemia perniciosa",  // 3
    // "Anemia perniciosa congénita",  // 3
    // "Angina acelerante",  // 3
    // "Angioma en cereza",  // 3
    // "Angiomas del colon",  // 3
    // "Anomalía del cayado aórtico",  // 3
    // "Anticoagulantes lúpicos",  // 3
    // "Artritis bacteriana no gonocócica",  // 3
    // "Ataque de pánico",  // 3
    // "Ataxia cerebelosa",  // 3
    // "Ateroembolia renal",  // 3
    // "Atrofia del nervio óptico",  // 3
    // "Azotemia prerrenal",  // 3
    // "Bacteriemia con sepsis",  // 3
    // "Balanopostitis",  // 3
    // "Bloqueo del oído",  // 3
    // "Bromhidrosis (mal olor corporal)",  // 3
    // "Bronquitis",  // 3
    // "Bronquitis obstructiva",  // 3
    // "CRAO",  // 3
    // "CRVO",  // 3
    // "Canal Estrecho Cervical",  // 3
    // "Canal Estrecho Lumbar",  // 3
    // "Carcinoma anaplásico de tiroides",  // 3
    // "Carcinoma lobulillar",  // 3
    // "Cardiomiopatía del periparto",  // 3
    // "Cefalea Cervicogénica",  // 3
    // "Cefalea en brotes",  // 3
    // "Chikungunya",  // 3
    // "Choque hipovolémico",  // 3
    // "Cifosis postural",  // 3
    // "Cirrosis o hepatitis alcohólica",  // 3
    // "Clavícula fracturada en un recién nacido",  // 3
    // "Colangitis biliar",  // 3
    // "Colangitis esclerosante",  // 3
    // "Colapso del cuidador",  // 3
    // "Colitis nerviosa",  // 3
    // "Colitis ulcerosa crónica inespecífica",  // 3
    // "Complejo relacionado con el SIDA (CRS)",  // 3
    // "Comunicación interauricular alta",  // 3
    // "Condilomas",  // 3
    // "Congestión pulmonar/de pulmón",  // 3
    // "Contracción ventricular prematura",  // 3
    // "Contractura isquémica de Volkmann",  // 3
    // "Cor pulmonale",  // 3
    // "Costra láctea",  // 3
    // "Criptococosis",  // 3
    // "Crisis epiléptica Jacksoniana",  // 3
    // "Crisis epiléptica en el lóbulo temporal",  // 3
    // "Crisis tiroidea",  // 3
    // "Cáncer en la vía urinaria: Riñón, Uréter, Vejiga, Próstata",  // 3
    // "Cáncer peniano",  // 3
    // "Cáncer tumores cerebrales",  // 3
    // "DDH",  // 3
    // "DERMATITIS",  // 3
    // "DOLORES ARTICULARES",  // 3
    // "Dacrioadenitis",  // 3
    // "Daño nervioso diabético",  // 3
    // "Defectos congénitos de la función plaquetaria",  // 3
    // "Deficiencia de antitrombina III congénita",  // 3
    // "Deficiencia de vitamina B12 (malabsorción)",  // 3
    // "Deficiencia de vitamina D",  // 3
    // "Deficiencia para ver los colores",  // 3
    // "Dermatitis Cenicienta",  // 3
    // "Dermatitis herpetiforme",  // 3
    // "Derrame cerebral hemorrágico",  // 3
    // "Desplazamiento",  // 3
    // "Diarrea por E. coli",  // 3
    // "Disfonía espasmódica",  // 3
    // "Disfunción Eréctil",  // 3
    // "Disfunción Tubárica",  // 3
    // "Disgenesia gonadal",  // 3
    // "Dishidrosis",  // 3
    // "Disrritmias",  // 3
    // "Dolor de cabeza benigno",  // 3
    // "Dolor de crecimiento",  // 3
    // "Dolor de rodillas",  // 3
    // "Drenaje venoso pulmonar anómalo total",  // 3
    // "Eccema dishidrótico",  // 3
    // "Edema postquirúrgico",  // 3
    // "Edema postraumático",  // 3
    // "Enanismo",  // 3
    // "Endometriosis interna",  // 3
    // "Endometriosis rectal",  // 3
    // "Enfermedad de Lyme primaria",  // 3
    // "Enfermedad de Ollier",  // 3
    // "Enfermedad de las motoneuronas",  // 3
    // "Enfermedad externa ocular",  // 3
    // "Enfermedad hemorrágica del recién nacido",  // 3
    // "Enfermedad hepática",  // 3
    // "Enfermedad sistémica relacionada con inmunoglobulina G4 (IgG4)",  // 3
    // "Enfermedad vascular cerebral",  // 3
    // "Enfermedades de riñón",  // 3
    // "Enfermedades neurológicas",  // 3
    // "Enfisema",  // 3
    // "Epiglotitis",  // 3
    // "Equimosis",  // 3
    // "Esclerosis Múltiple",  // 3
    // "Esofagitis por cándida",  // 3
    // "Esofagitis péptica",  // 3
    // "Espoleón calcáneo",  // 3
    // "Esquizofrenia hebefrénica",  // 3
    // "Estado de abstinencia alcohólica",  // 3
    // "Estenosis arterial renal",  // 3
    // "Estenosis valvular pulmonar",  // 3
    // "Estomatitis herpética",  // 3
    // "Estrabismo convergente (ojos bizcos)",  // 3
    // "Estreñimiento crónico",  // 3
    // "Estrés en niños",  // 3
    // "Evento vascular cerebral",  // 3
    // "Extrasístole",  // 3
    // "Eyaculación retrasada en el sexo",  // 3
    // "Fagofobia",  // 3
    // "Feminización testicular",  // 3
    // "Fenómeno de Raynaud",  // 3
    // "Fibriloaleteo auricular",  // 3
    // "Fibrosis pulmonar intersticial difusa idiopática",  // 3
    // "Fimosis y Prepucio Redundante",  // 3
    // "Fobias",  // 3
    // "Fractura vertical osteoporotica",  // 3
    // "Fracturas nasales",  // 3
    // "Fragilidad",  // 3
    // "Fístula Ureterovaginal",  // 3
    // "Gestión de emociones",  // 3
    // "Giardiasis",  // 3
    // "Glomerulonefritis (GN) postinfecciosa",  // 3
    // "HPN",  // 3
    // "Hemangioma cavernoso",  // 3
    // "Hemangioma simple",  // 3
    // "Hematocele",  // 3
    // "Hematoma retroplacentario",  // 3
    // "Heridas de pie diabético",  // 3
    // "Hermafroditismo",  // 3
    // "Hidrocefalia idiopática",  // 3
    // "Hidronefrosis unilateral",  // 3
    // "Hidropesía fetal",  // 3
    // "Hiperplasia paratiroidea",  // 3
    // "Hipertensión arterial pulmonar idiopática",  // 3
    // "Hipertensión de tipo renovascular",  // 3
    // "Hipertensión inducida por fármacos",  // 3
    // "Hipoparatiroidismo",  // 3
    // "Hipotensión mediada neuralmente",  // 3
    // "INFECCION DE VIAS URINARIAS",  // 3
    // "Ileítis",  // 3
    // "Impétigo",  // 3
    // "Incompatibilidad ABO",  // 3
    // "Incontinencia Urinaria de Urgencia",  // 3
    // "Incontinencia imperiosa",  // 3
    // "Infecciones de la glándula salival",  // 3
    // "Infección aguda del oído medio",  // 3
    // "Infección asintomática del oído",  // 3
    // "Infección crónica del oído externo",  // 3
    // "Infección de los senos paranasales",  // 3
    // "Infección de un folículo piloso",  // 3
    // "Infección de válvulas",  // 3
    // "Infección de vías respiratorias superiores",  // 3
    // "Infección del esófago por hongos levaduriformes",  // 3
    // "Infección sinusal crónica",  // 3
    // "Inflamación de columna",  // 3
    // "Insuficiencia Adrenal",  // 3
    // "Insuficiencia cardíaca congestiva izquierda (insuficiencia ventricular izquierda)",  // 3
    // "Insuficiencia cardíaca izquierda",  // 3
    // "Insuficiencia del intestino delgado",  // 3
    // "Insulinoma",  // 3
    // "Intolerancia a la fructosa",  // 3
    // "Intoxicación con anfetaminas",  // 3
    // "Intoxicación con estimulantes",  // 3
    // "Intoxicación con marihuana",  // 3
    // "Intususcepción en los niños",  // 3
    // "Isquemia de las arterias mesentéricas",  // 3
    // "LLA",  // 3
    // "Latidos cardíacos ectópicos",  // 3
    // "Leiomiosarcoma",  // 3
    // "Lesión de oído",  // 3
    // "Lesión inflamatoria del riñón",  // 3
    // "Lesión traumática del riñón",  // 3
    // "Lesión uretral",  // 3
    // "Leucemia Linfocítica crónica",  // 3
    // "Leucemia aguda granulocítica",  // 3
    // "Leucemia linfoblástica aguda",  // 3
    // "Leucemia mieloblástica aguda",  // 3
    // "Leucemia mieloide crónica",  // 3
    // "Leucemia no linfocítica aguda",  // 3
    // "Linfogranuloma inguinal",  // 3
    // "Linfogranuloma venéreo",  // 3
    // "Linfoma cerebral",  // 3
    // "Linfoma linfocítico",  // 3
    // "Linfoma linfoplasmacítico",  // 3
    // "Léntigos solares o seniles",  // 3
    // "Macroglobulinemia de Waldenstrom",  // 3
    // "Mala posición del útero",  // 3
    // "Malformación de Ebstein",  // 3
    // "Manchas de color café con leche",  // 3
    // "Manos entumidas",  // 3
    // "Mareos",  // 3
    // "Mastoiditis",  // 3
    // "Mediastinitis",  // 3
    // "Meduloblastoma en adultos",  // 3
    // "Meduloblastoma en niños",  // 3
    // "Megacolon congénito",  // 3
    // "Meibomianitis",  // 3
    // "Meningioma",  // 3
    // "Metástasis ósea",  // 3
    // "Mieloma de células plasmáticas",  // 3
    // "Miocardiopatía infiltrativa",  // 3
    // "Miopatía hereditaria",  // 3
    // "Misofonía",  // 3
    // "Mononeuropatía del III par craneal de tipo diabético",  // 3
    // "Mononucleosis por CMV",  // 3
    // "NIC",  // 3
    // "Necrosis tubular aguda",  // 3
    // "Nefrocalcinosis",  // 3
    // "Nefropatía terminal",  // 3
    // "Neoplasia endocrina múltiple (NEM) I",  // 3
    // "Neumoconiosis de los mineros del carbón",  // 3
    // "Neumomediastino",  // 3
    // "Neumonitis intersticial común",  // 3
    // "Neumonitis por hipersensibilidad",  // 3
    // "Neumonitis pulmonar idiopática (NPI)",  // 3
    // "Neumonía extrahospitalaria",  // 3
    // "Neuropatía autónoma",  // 3
    // "Nutrición para microbiota intestinal",  // 3
    // "Nutrición para salud hormonal",  // 3
    // "Nódulo pulmonar solitario",  // 3
    // "Obstrucción de las vías urinarias bajas",  // 3
    // "Obstrucción del orificio gástrico",  // 3
    // "Obstrucción uretral aguda",  // 3
    // "Oligodendroglioma en adultos",  // 3
    // "Osteoartrosis degenerativa",  // 3
    // "Osteocondritis deformante juvenil",  // 3
    // "Otitis externa maligna",  // 3
    // "Parestesia",  // 3
    // "Parkinson y Trastornos del Movimiento",  // 3
    // "Parkinsonismo de tipo secundario",  // 3
    // "Paroniquia",  // 3
    // "Piel grasa",  // 3
    // "Piojos púbicos",  // 3
    // "Policitemia vera",  // 3
    // "Polifarmacia",  // 3
    // "Polimiositis del adulto",  // 3
    // "Polineuropatía inflamatoria aguda",  // 3
    // "Presión sanguínea baja",  // 3
    // "Proctitis",  // 3
    // "Prostatitis no bacteriana",  // 3
    // "Prurito en la ingle",  // 3
    // "Psicosis reactiva breve",  // 3
    // "Psoriasis en placa",  // 3
    // "Queratosis actínica",  // 3
    // "Queratosis pilar",  // 3
    // "Quiste aracnoideo",  // 3
    // "Quiste del conducto de Gartner",  // 3
    // "Quiste o tumor benigno de oído",  // 3
    // "Rabdomiosarcoma alveolar",  // 3
    // "Rabdomiólisis",  // 3
    // "Raquitismo",  // 3
    // "Reacción a una transfusión",  // 3
    // "Reacción a una transfusión de sangre",  // 3
    // "Riñones quísticos",  // 3
    // "Rubéola",  // 3
    // "SINUSITIS AGUDA Y CRONICA",  // 3
    // "Salmonelosis",  // 3
    // "Salpingo ooforitis",  // 3
    // "Sangrado del tubo digestivo bajo",  // 3
    // "Sarcoidosis",  // 3
    // "Sarcoma de Kaposi",  // 3
    // "Sarna",  // 3
    // "Separación prematura de la placenta",  // 3
    // "Seudohermafroditismo masculino incompleto",  // 3
    // "Seudoobstrucción colónica",  // 3
    // "Seudoobstrucción intestinal crónica",  // 3
    // "Seudoobstrucción intestinal idiopática",  // 3
    // "Seudoobstrucción intestinal primaria",  // 3
    // "Shock hipovolémico",  // 3
    // "Sindrome de West",  // 3
    // "Sobreproducción ovárica de andrógenos",  // 3
    // "Sordera súbita",  // 3
    // "Subluxación",  // 3
    // "Subluxación vertebral",  // 3
    // "Síndrome de Asherman",  // 3
    // "Síndrome de Bartter",  // 3
    // "Síndrome de Marfan",  // 3
    // "Síndrome de apnea e hipopnea obstructivas del sueño (SAHOS)",  // 3
    // "Síndrome de dificultad respiratoria aguda",  // 3
    // "Síndrome de oclusión de la arteria subclavia",  // 3
    // "Síndrome de oclusión de la arteria vertebrobasilar",  // 3
    // "Síndrome de seroconversión por VIH",  // 3
    // "Síndrome del prolapso de la valva mitral",  // 3
    // "Síndrome nefrótico de cambio mínimo",  // 3
    // "Síndrome respiratorio agudo severo (SARS)",  // 3
    // "Síndrome urémico hemolítico",  // 3
    // "Taponamiento pericárdico",  // 3
    // "Testículo no descendido",  // 3
    // "Tiña del cuerpo",  // 3
    // "Toxemia",  // 3
    // "Trastorno de estrés postraumático",  // 3
    // "Trastorno de vinculación reactiva de la lactancia o la primera infancia",  // 3
    // "Trastorno depresivo",  // 3
    // "Trastorno fonológico",  // 3
    // "Trastornos neurocognitivos",  // 3
    // "Trastornos neurológicos",  // 3
    // "Trastornos plaquetarios cualitativos adquiridos",  // 3
    // "Trombocitemia primaria",  // 3
    // "Trombos",  // 3
    // "Tumor",  // 3
    // "Tumor del glomo timpánico",  // 3
    // "Uropatía obstructiva",  // 3
    // "Uveítis anterior",  // 3
    // "Vaginitis por tricomonas",  // 3
    // "Vasculitis alérgica",  // 3
    // "Vasculitis necrosante",  // 3
    // "Verrugas planas juveniles",  // 3
    // "Visión baja",  // 3
    // "Válvula aórtica bicúspide",  // 3
    // "Vértigo",  // 3
    // "Émbolo pulmonar",  // 3
    // "Íleo paralítico",  // 3
    // "Úlceras linfáticas",  // 3
    // "ASH",  // 2
    // "ATR clásica",  // 2
    // "AVSD",  // 2
    // "Aboulomanía",  // 2
    // "Absceso Renal",  // 2
    // "Absceso epidural",  // 2
    // "Absceso perirrenal",  // 2
    // "Absceso subcutáneo",  // 2
    // "Abstinencia de nicotina",  // 2
    // "Accidente cerebrovascular relacionado con el consumo de cocaína",  // 2
    // "Acondroplasia",  // 2
    // "Acrodermatitis",  // 2
    // "Acúfeno",  // 2
    // "Adenoma somatotrófico",  // 2
    // "Agranulocitosis",  // 2
    // "Albinismo",  // 2
    // "Albinismo ocular",  // 2
    // "Alcalosis",  // 2
    // "Alcalosis respiratoria",  // 2
    // "Alergia a medicamentos",  // 2
    // "Alteraciones del sueño",  // 2
    // "Alveolitis alérgica extrínseca",  // 2
    // "Amebiasis extraintestinal",  // 2
    // "Amiloidosis cerebral",  // 2
    // "Amiloidosis primaria",  // 2
    // "Anafilaxia",  // 2
    // "Anemia hemolítica a causa de deficiencia de G-6-PD",  // 2
    // "Anemia hemolítica autoinmunitaria idiopática",  // 2
    // "Anemia idiopática aplásica",  // 2
    // "Angina de Ludwig",  // 2
    // "Anillo esofagogástrico",  // 2
    // "Anillo esofágico inferior",  // 2
    // "Anomalía de Taussig-Bing",  // 2
    // "Anomalías congénitas de la función plaquetaria",  // 2
    // "Anomalías del olfato",  // 2
    // "Ansiedad en niños",  // 2
    // "Apoplejía secundaria a la displasia fibromuscular",  // 2
    // "Arco aórtico derecho con subclavia y ligamento izquierdo anómalos",  // 2
    // "Arteritis temporal",  // 2
    // "Artritis gonocócica",  // 2
    // "Artritis reumatoide juvenil",  // 2
    // "Artritis séptica",  // 2
    // "Artritis viral",  // 2
    // "Asma pediátrica",  // 2
    // "Aspergilosis",  // 2
    // "Aspergilosis broncopulmonar alérgica",  // 2
    // "Atelectasia",  // 2
    // "Atresia tricuspídea",  // 2
    // "Ausencia de la válvula pulmonar",  // 2
    // "Autoestima",  // 2
    // "Bacterias necrosantes",  // 2
    // "Baja autoestima en adolescentes",  // 2
    // "Barros",  // 2
    // "Bartonellosis",  // 2
    // "Blastomicosis",  // 2
    // "Bocio nodular",  // 2
    // "Bocio tirotóxico difuso",  // 2
    // "Bridas amnióticas",  // 2
    // "Bronquiectasia congénita",  // 2
    // "Bronquitis ocupacional",  // 2
    // "CANSANCIO Y DEBILIDAD",  // 2
    // "CONJUNTIVITIS",  // 2
    // "CPV",  // 2
    // "Cambios queratósicos en la piel inducidos por el sol",  // 2
    // "Cambios vasculares de la piel",  // 2
    // "Candidiasis cutánea",  // 2
    // "Carcinoma bucal de células escamosas",  // 2
    // "Carcinoma microcítico de pulmón",  // 2
    // "Ceguera monocular transitoria",  // 2
    // "Chlamydophila pneumoniae",  // 2
    // "Cicatrices",  // 2
    // "Cistitis por radiación",  // 2
    // "Cistitis recurrente",  // 2
    // "Colangiocarcinoma",  // 2
    // "Colocación de espaciador interespinoso",  // 2
    // "Coma hiperosmolar hiperglucémico no cetónico",  // 2
    // "Complejo de Eisenmenger",  // 2
    // "Condiciones relacionadas con ictericia",  // 2
    // "Contusión miocárdica",  // 2
    // "Convulsión del lóbulo temporal",  // 2
    // "Corea de Huntington",  // 2
    // "Coriocarcinoma",  // 2
    // "Cortedad anormal del frenillo lingual",  // 2
    // "Coágulo en la vena renal",  // 2
    // "Crioglobulinemia",  // 2
    // "Crisis hipertiroidea",  // 2
    // "Crup espasmódico",  // 2
    // "Crup viral",  // 2
    // "Cryptosporidiosis",  // 2
    // "Cáncer canal anal",  // 2
    // "Cáncer escamocelular del pene",  // 2
    // "Cáncer metastásico al pulmón",  // 2
    // "Cólera",  // 2
    // "DIABETES MELLITUS",  // 2
    // "DISLIPIDEMIAS MIXTA",  // 2
    // "DOLOR CERVICAL",  // 2
    // "DOLOR DE OIDOS",  // 2
    // "Daltonismo",  // 2
    // "Daño a los nervios laríngeos",  // 2
    // "Defecto adquirido de la función plaquetaria",  // 2
    // "Defecto del tabique aortopulmonar",  // 2
    // "Deficiencia congénita de proteína C o S",  // 2
    // "Deficiencia de piruvatocinasa",  // 2
    // "Degeneración macular senil (SMD)",  // 2
    // "Demencia frontotemporal",  // 2
    // "Dermatitis exfoliativa",  // 2
    // "Dermatitis perioral",  // 2
    // "Dermatosis (sistémica)",  // 2
    // "Derrame pleural relacionado con el asbesto",  // 2
    // "Desgarro de Mallory-Weiss",  // 2
    // "Deterioro de la audición en los bebés",  // 2
    // "Dextrocardia",  // 2
    // "Discapacidad degenerativas",  // 2
    // "Discopatía",  // 2
    // "Discrasia de células plasmáticas",  // 2
    // "Distonía",  // 2
    // "Distrofias musculares de la cintura y extremidades",  // 2
    // "Donovanosis",  // 2
    // "Eccema numular",  // 2
    // "Ectasia vascular del colon",  // 2
    // "Edema por parálisis",  // 2
    // "Edema pulmonar",  // 2
    // "Ehrlichiosis",  // 2
    // "Eliptocitosis de tipo hereditario",  // 2
    // "Endotropía",  // 2
    // "Endurecimiento de las arterias",  // 2
    // "Enfermedad ateroembólica de los riñones",  // 2
    // "Enfermedad con cambios mínimos",  // 2
    // "Enfermedad de Chagas",  // 2
    // "Enfermedad de Creutzfeldt-Jakob",  // 2
    // "Enfermedad de Cushing hipofisaria",  // 2
    // "Enfermedad de Eisenmenger",  // 2
    // "Enfermedad de Lyme de diseminación temprana",  // 2
    // "Enfermedad de Lyme terciaria",  // 2
    // "Enfermedad de Paget",  // 2
    // "Enfermedad de Peyrone",  // 2
    // "Enfermedad del arañazo de gato",  // 2
    // "Enfermedad hemolítica del neonato inducida por Rh",  // 2
    // "Enfermedad por anticuerpos contra la membrana basal glomerular",  // 2
    // "Enfermedad renal ateroembólica",  // 2
    // "Enfermedad renal ateroesclerótica",  // 2
    // "Enfermedad renal poliquística autosómica dominante",  // 2
    // "Enfermedad similar al dengue",  // 2
    // "Enfermedades de genitales",  // 2
    // "Enfermedades degenerativas de los pies",  // 2
    // "Enfermedades del pie",  // 2
    // "Enfermedades neurodegenerativas",  // 2
    // "Enfermedades pulmonares intersticiales",  // 2
    // "Ensuciarse en la ropa",  // 2
    // "Enteritis regional",  // 2
    // "Ependimoma en niños",  // 2
    // "Epididimitis (Orquiepididimitis)",  // 2
    // "Episodios cianóticos en recién nacidos",  // 2
    // "Equinococo",  // 2
    // "Eritema multiforme",  // 2
    // "Esclerosis Lateral Amiotrófica",  // 2
    // "Escorbuto",  // 2
    // "Escrófula",  // 2
    // "Espasmo vascular",  // 2
    // "Espasmos del llanto",  // 2
    // "Estenosis subaórtica hipertrófica e idiopática",  // 2
    // "Estrés adolescentes",  // 2
    // "Estrés en adolescentes",  // 2
    // "Etmoiditis",  // 2
    // "Exceso de hormona del crecimiento",  // 2
    // "Extracción de uña enterrada",  // 2
    // "Faringitis estreptocócica",  // 2
    // "Fibrilación ventricular",  // 2
    // "Fibroides",  // 2
    // "Fibroplasia retrolenticular o retrocristaliniana",  // 2
    // "Fractura de clavícula",  // 2
    // "Fractura de muñeca",  // 2
    // "Fractura de tobillo y pie",  // 2
    // "Fístula Vesicovaginal",  // 2
    // "Fístula de la arteria coronaria",  // 2
    // "Gangrena gaseosa",  // 2
    // "Glioma del nervio óptico",  // 2
    // "Glioma en niños",  // 2
    // "Glomerulonefritis (GN) posestreptocócica",  // 2
    // "Glomerulonefritis postestreptocócica",  // 2
    // "Glomerulonefritis rápidamente progresiva",  // 2
    // "Glomerulopatias",  // 2
    // "Glositis",  // 2
    // "Granuloma piógeno",  // 2
    // "HIPERTENSIÓN ARTERIAL",  // 2
    // "HIPERTRIGLICERIDEMIA",  // 2
    // "HUS",  // 2
    // "Hallux Valgus",  // 2
    // "Hemacromatosis",  // 2
    // "Hemangioma capilar",  // 2
    // "Hemangioma plano",  // 2
    // "Hematocromatosis",  // 2
    // "Hemocromatosis",  // 2
    // "Hemofilia A",  // 2
    // "Hemofilia B",  // 2
    // "Hemofilia por el factor IX",  // 2
    // "Hemoglobinopatía",  // 2
    // "Hemoglobinuria paroxística nocturna",  // 2
    // "Hemorragia en el espacio subaracnoideo",  // 2
    // "Hemorragia intracerebral lobular",  // 2
    // "Hemorragia intracerebral profunda",  // 2
    // "Hemorragia intraparenquimal",  // 2
    // "Hemorragia pulmonar por glomerulonefritis",  // 2
    // "Hemorragia subdural",  // 2
    // "Hepatopatía alcohólica",  // 2
    // "Hernia congénita del diafragma",  // 2
    // "Hernia transtentorial",  // 2
    // "Hernia ventral",  // 2
    // "Hidrocefalia obstructiva extraventricular",  // 2
    // "Hiperacusia",  // 2
    // "Hiperandrogenismo",  // 2
    // "Hipercalciuria idiopática",  // 2
    // "Hiperesplenismo",  // 2
    // "Hipertensión pulmonar primaria",  // 2
    // "Hipertensión pulmonar secundaria",  // 2
    // "Hipertricosis",  // 2
    // "Hipervitaminosis A",  // 2
    // "Hipofosfatemia",  // 2
    // "Hipofunción ovárica",  // 2
    // "Hipogonadismo secundario",  // 2
    // "Hipopituitarismo",  // 2
    // "Hipotensión posprandial",  // 2
    // "Hipotiroidismo en bebés",  // 2
    // "Hipotiroidismo inducido por medicamentos",  // 2
    // "Histiocitosis X pulmonar",  // 2
    // "Huesos delgados",  // 2
    // "ITU asociada con el uso de catéter",  // 2
    // "Ictericia por la leche materna",  // 2
    // "Ileocolitis granulomatosa",  // 2
    // "Impactación fecal o intestinal",  // 2
    // "Incompatibilidad RH",  // 2
    // "Incompetencia eyaculatoria",  // 2
    // "Incontinencia con tenesmo",  // 2
    // "Infección Aguda de la Vía Urinaria Complicada (IVU)",  // 2
    // "Infección crónica del oído medio",  // 2
    // "Infección cutánea por estafilococos",  // 2
    // "Infección de garganta por estreptococos",  // 2
    // "Infección del esófago por cándida",  // 2
    // "Infección por VIH primaria",  // 2
    // "Infección por oxiuros",  // 2
    // "Inflamación de los bronquios",  // 2
    // "Inflamación del esófago",  // 2
    // "Inflamación del recto",  // 2
    // "Insomnio primario",  // 2
    // "Insuficiencia cardíaca congestiva derecha (insuficiencia ventricular derecha)",  // 2
    // "Intestino muerto",  // 2
    // "Intoxicación por monóxido de carbono",  // 2
    // "Intoxicación por químicos del hogar",  // 2
    // "Inyección Intravitrea",  // 2
    // "Isquemia hepática",  // 2
    // "Jaqueca",  // 2
    // "LMA",  // 2
    // "LMC",  // 2
    // "Laringomalacia",  // 2
    // "Laringotraqueitis",  // 2
    // "Latido ventricular prematuro, PVB",  // 2
    // "Latidos prematuros",  // 2
    // "Lepra",  // 2
    // "Lesiones de nervio periférico",  // 2
    // "Lesión cerebral en bebés",  // 2
    // "Lesión de ligamentos",  // 2
    // "Lesión del riñón y uréter",  // 2
    // "Lesión vesical",  // 2
    // "Liendres",  // 2
    // "Linfadenopatía localizada",  // 2
    // "Linfoma histiocítico",  // 2
    // "Linfopatía venérea",  // 2
    // "Liposarcoma",  // 2
    // "MAREO Y VERTIGO",  // 2
    // "MRSA intrahospitalaria (HA-MRSA)",  // 2
    // "Macroglobulinemia primaria",  // 2
    // "Magnesio bajo en la sangre",  // 2
    // "Malformaciones pulmonares congénitas",  // 2
    // "Manchas en la piel",  // 2
    // "Marcas de nacimiento pigmentadas",  // 2
    // "Marcas de nacimiento rojas",  // 2
    // "Mastocitosis",  // 2
    // "Melanoma maligno de la coroides",  // 2
    // "Meningitis meningocócica",  // 2
    // "Meningitis por bacterias gramnegativas",  // 2
    // "Meningitis sifilítica",  // 2
    // "Metástasis a los pulmones",  // 2
    // "Mielofibrosis idiopática",  // 2
    // "Migraña tensional mixta",  // 2
    // "Migrañas",  // 2
    // "Miocardiopatía restrictiva",  // 2
    // "Mioclonía nocturna",  // 2
    // "Misofobia",  // 2
    // "Mixedema",  // 2
    // "Mixoma auricular",  // 2
    // "Mononeuritis múltiple",  // 2
    // "Mononeuropatía",  // 2
    // "Mononeuropatía del VI par craneal",  // 2
    // "Mordeduras de araña",  // 2
    // "Mordeduras de serpiente",  // 2
    // "Muerte cerebral",  // 2
    // "Narcolepsia",  // 2
    // "Nefritis crónica",  // 2
    // "Nefritis tubulointersticial",  // 2
    // "Nefropatía lùpica",  // 2
    // "Nefropatía membranosa",  // 2
    // "Nefropatía por IgA",  // 2
    // "Neoplasia",  // 2
    // "Neoplasia trofoblástica gestacional",  // 2
    // "Neumocistosis",  // 2
    // "Neumoconiosis reumatoidea",  // 2
    // "Neumonía necrosante",  // 2
    // "Neumonía por hidrocarburos",  // 2
    // "Neumopatía crónica",  // 2
    // "Neumopatía por humidificador o aire acondicionado",  // 2
    // "Neumopatía por reflujo",  // 2
    // "Neumotórax espontáneo",  // 2
    // "Neumotórax traumático",  // 2
    // "Neuritis vestibular",  // 2
    // "Neuroblastoma",  // 2
    // "Neurofibromatosis 2",  // 2
    // "Neurofibromatosis-1",  // 2
    // "Neuroma acústico",  // 2
    // "Neurosífilis",  // 2
    // "Obstrucción de la unión U-P",  // 2
    // "Obstrucción de la vena cava superior",  // 2
    // "Obstrucción de la válvula mitral",  // 2
    // "Oclusión en la vena renal",  // 2
    // "Ojeras",  // 2
    // "Osteoartritis hipertrófica",  // 2
    // "Osteopenia",  // 2
    // "Otitis media con derrame",  // 2
    // "Otitis media serosa",  // 2
    // "PIE DE ATLETA",  // 2
    // "PTI",  // 2
    // "PTT",  // 2
    // "Paludismo o malaria por Falciparum",  // 2
    // "Panhipopituitarismo",  // 2
    // "Papiloma intraductal",  // 2
    // "Papilomas",  // 2
    // "Paraganglionoma",  // 2
    // "Pars planitis",  // 2
    // "Parálisis con temblor",  // 2
    // "Parálisis del sueño aislada",  // 2
    // "Parálisis general",  // 2
    // "Patología ungueal",  // 2
    // "Penfigoide ampolloso",  // 2
    // "Perforación del Septum",  // 2
    // "Pericarditis constrictiva",  // 2
    // "Pericarditis después de un ataque cardíaco",  // 2
    // "Peritonitis bacteriana espontánea (PBE)",  // 2
    // "Peritonitis espontánea",  // 2
    // "Peste",  // 2
    // "Piel sensible",  // 2
    // "Pielonefritis atrófica crónica",  // 2
    // "Piojos de la cabeza",  // 2
    // "Pitiriasis rosada",  // 2
    // "Pitiriasis versicolor",  // 2
    // "Plasmacitoma del hueso",  // 2
    // "Plasmacitoma maligno",  // 2
    // "Poliartritis crónica juvenil",  // 2
    // "Policitemia con cianosis crónica: policitemia mielopática",  // 2
    // "Policitemia criptógena",  // 2
    // "Prematuro",  // 2
    // "Priapismo",  // 2
    // "Problema de identidad o Trastorno de identidad",  // 2
    // "Problemas del sueño",  // 2
    // "Procesamiento Central Auditivo",  // 2
    // "Procesos inflamatorios del segmento posterior",  // 2
    // "Proteinuria",  // 2
    // "Protoporfiria eritropoyética",  // 2
    // "Pruebas de antígeno COVID-19",  // 2
    // "Psoriasis en gotas",  // 2
    // "Pulmón del prematuro",  // 2
    // "Pénfigo seborreico",  // 2
    // "Pérdida de la audición a causa del trabajo",  // 2
    // "Púrpura trombocitopénica trombótica",  // 2
    // "Queratitis por Acanthamoeba",  // 2
    // "ROP",  // 2
    // "Radiculopatía",  // 2
    // "Reacción leucemoide",  // 2
    // "Rechazo al injerto",  // 2
    // "Reflujo uretral",  // 2
    // "Regurgitación mitral aguda",  // 2
    // "Retención fecal",  // 2
    // "Reumatismo",  // 2
    // "Rickettsiosis exantemática",  // 2
    // "Rinofima",  // 2
    // "Riñón fracturado",  // 2
    // "Ronquidos",  // 2
    // "Ruptura uretral",  // 2
    // "SINDROME DE INTESTINO IRRITABLE",  // 2
    // "Secuelas covid 19",  // 2
    // "Secuencia de bandas amnióticas",  // 2
    // "Selectividad alimentaria",  // 2
    // "Seudohermafroditismo",  // 2
    // "Seudohipoparatiroidismo",  // 2
    // "Seudotumor orbital",  // 2
    // "Shock bacteriémico",  // 2
    // "Sordera",  // 2
    // "Syrinx",  // 2
    // "Sífilis congénita",  // 2
    // "Sífilis fetal",  // 2
    // "Sífilis primaria",  // 2
    // "Sífilis terciaria",  // 2
    // "Síndrome cerebral orgánico crónico",  // 2
    // "Síndrome de CREST",  // 2
    // "Síndrome de Dressler",  // 2
    // "Síndrome de Ehlers-Danlos",  // 2
    // "Síndrome de Eisenmenger",  // 2
    // "Síndrome de Felty",  // 2
    // "Síndrome de Guillan-Barre",  // 2
    // "Síndrome de Hermansky-Pudlak",  // 2
    // "Síndrome de Lambert-Eaton",  // 2
    // "Síndrome de Osler-Weber-Rendu",  // 2
    // "Síndrome de Peutz-Jeghers",  // 2
    // "Síndrome de Prader-Willi",  // 2
    // "Síndrome de Rett",  // 2
    // "Síndrome de Sheehan",  // 2
    // "Síndrome de Tourette",  // 2
    // "Síndrome de hipoventilación por obesidad",  // 2
    // "Síndrome de la serotonina",  // 2
    // "Síndrome de la vena cava superior",  // 2
    // "Síndrome del abdomen en ciruela pasa",  // 2
    // "Síndrome del corazón rígido",  // 2
    // "Síndrome del periforme",  // 2
    // "Síndrome del seno enfermo",  // 2
    // "Síndrome estafilocócico de la piel escaldada (SSS)",  // 2
    // "Síndrome hepatorrenal",  // 2
    // "Síndrome mielodisplásico",  // 2
    // "Síndrome nefrótico idiopático de la niñez",  // 2
    // "TRATAMIENTO DE LA DIARREA",  // 2
    // "Taponamiento",  // 2
    // "Taquicardia de complejo amplio",  // 2
    // "Tendinitis aquílea",  // 2
    // "Tenia",  // 2
    // "Tercer ventriculostomía endoscópica",  // 2
    // "Testículo mal descendido",  // 2
    // "Tic doloroso",  // 2
    // "Tifus",  // 2
    // "Tiroiditis autoinmunitaria",  // 2
    // "Tiroiditis de DeQuervain",  // 2
    // "Tiroiditis linfocítica",  // 2
    // "Tiroiditis linfocítica subaguda",  // 2
    // "Tiroiditis no supurativa subaguda",  // 2
    // "Tiroiditis subaguda",  // 2
    // "Tiña inguinal",  // 2
    // "Tiña versicolor",  // 2
    // "Tos convulsiva",  // 2
    // "Toxoplasmosis congénita",  // 2
    // "Traqueomalacia adquirida",  // 2
    // "Trastorno de movimientos estereotípicos",  // 2
    // "Trastorno dismórfico corporal",  // 2
    // "Trastornos adquiridos de la función plaquetaria",  // 2
    // "Trastornos de la Eyaculación",  // 2
    // "Trastornos del habla",  // 2
    // "Trastornos urológicos",  // 2
    // "Traumatismo medio de la cara",  // 2
    // "Trombastenia de Glanzmann",  // 2
    // "Trombocitemia esencial",  // 2
    // "Trombocitopatia",  // 2
    // "Trombocitopenia inmunitaria inducida por medicamentos",  // 2
    // "Trombocitopenia no inmunitaria inducida por fármacos",  // 2
    // "Trombosis aguda de la arteria renal",  // 2
    // "Trombosis de la vena renal",  // 2
    // "Tumor de células de Leydig",  // 2
    // "Tumor de células de los islotes pancreáticos",  // 2
    // "Tumor de células germinativas",  // 2
    // "Tumor de la fosa posterior",  // 2
    // "Tumor de los cordones sexuales",  // 2
    // "Tumor del ángulo",  // 2
    // "Tumor hipotalámico",  // 2
    // "Tumor nasal benigno",  // 2
    // "Ulceras vasculares",  // 2
    // "Uretritis crónica",  // 2
    // "Uropatía obstructiva bilateral crónica",  // 2
    // "Uñas encarnadas",  // 2
    // "Vaciamiento gástrico retardado",  // 2
    // "Vejiga espasmódica",  // 2
    // "Vejiga inestable",  // 2
    // "Venas de araña",  // 2
    // "Ventrículo único (corazón univentricular)",  // 2
    // "Vulvitis",  // 2
    // "Válvula mitral floja",  // 2
    // "Válvula mitral mixomatosa",  // 2
    // "Vértigo Central",  // 2
    // "Ántrax",  // 2
    // "Úlceras flevostáticas",  // 2
    // "AGH",  // 1
    // "AIT",  // 1
    // "ALCAPA",  // 1
    // "AOP",  // 1
    // "ATR distal",  // 1
    // "ATR proximal",  // 1
    // "ATR tipo I",  // 1
    // "ATR tipo II",  // 1
    // "AVN",  // 1
    // "Abetalipoproteinemia",  // 1
    // "Abstinencia de la cocaína",  // 1
    // "Abstinencia de opioides",  // 1
    // "Abstinencia de opiáceos",  // 1
    // "Acantocitosis",  // 1
    // "Accidente cerebrovascular pequeño",  // 1
    // "Accidente cerebrovascular secundario a displasia fibromuscular",  // 1
    // "Adenitis tuberculosa",  // 1
    // "Adenoma de células insulares",  // 1
    // "Adenoma de hipófisis",  // 1
    // "Adicción al tabaco",  // 1
    // "Adrenoleucodistrofia",  // 1
    // "Afasia",  // 1
    // "Afibrinogenemia congénita",  // 1
    // "Agammaglobulinemia",  // 1
    // "Agammaglobulinemia de Bruton",  // 1
    // "Agammaglobulinemia ligada al cromosoma X",  // 1
    // "Agenesia de la válvula pulmonar",  // 1
    // "Agente delta (hepatitis D)",  // 1
    // "Aire alrededor de los pulmones",  // 1
    // "Alelectasia",  // 1
    // "Alteraciones articulares",  // 1
    // "Alucinosis alcohólica",  // 1
    // "Alveolitis fibrosante criptógena",  // 1
    // "Amebiasis intestinal",  // 1
    // "Amiloidosis cardíaca",  // 1
    // "Amiloidosis hereditaria",  // 1
    // "Amiloidosis senil",  // 1
    // "Anaplasmosis granulocítica humana",  // 1
    // "Anemia aquílica macrocítica",  // 1
    // "Anemia hemolítica autoinmunológica",  // 1
    // "Anemia hemolítica inmunitaria inducida por medicamentos",  // 1
    // "Anemia mediterránea",  // 1
    // "Anemia por deficiencia de folato",  // 1
    // "Anemia por inflamación",  // 1
    // "Anencefalia",  // 1
    // "Angina variante",  // 1
    // "Angioedema hereditario",  // 1
    // "Angiofibroma juvenil",  // 1
    // "Angiomiolipoma",  // 1
    // "Angioosteohipertrofia",  // 1
    // "Angiopatía amiloide cerebral",  // 1
    // "Anillo de Schatzki",  // 1
    // "Anomalía hereditaria del ciclo de la urea",  // 1
    // "Anorquia",  // 1
    // "Anosmia",  // 1
    // "Anquilostomosis",  // 1
    // "Antrosilicosis",  // 1
    // "Arco aórtico doble",  // 1
    // "Arrenoblastoma del ovario",  // 1
    // "Arrugas",  // 1
    // "Arteria coronaria izquierda anómala",  // 1
    // "Arterioesclerosis obliterante",  // 1
    // "Arteritis craneal",  // 1
    // "Asbestosis",  // 1
    // "Ascariasis",  // 1
    // "Aspergilosis pulmonar invasiva",  // 1
    // "Astrocitoma",  // 1
    // "Ataxia-telangiectasia",  // 1
    // "Atresia biliar",  // 1
    // "Atrofia del segundo par craneal",  // 1
    // "Atrofia muscular neuropática progresiva del peroneo",  // 1
    // "Aumento de la presión intracraneal",  // 1
    // "Ausencia del factor intrínseco",  // 1
    // "Autosabotaje",  // 1
    // "Bacteremia",  // 1
    // "Bacteriemia gonocócica",  // 1
    // "Bajo nivel de calcio en los bebés",  // 1
    // "Balance sagittal",  // 1
    // "Bilirrubinemia benigna no conjugada",  // 1
    // "Bloqueo de la vena cava superior",  // 1
    // "Bloqueo facetario percutáneo",  // 1
    // "Bronquiectasia adquirida",  // 1
    // "Bronquitis industrial",  // 1
    // "CAP",  // 1
    // "CI",  // 1
    // "CIDP",  // 1
    // "CML",  // 1
    // "COVID 19  de alto riesgo",  // 1
    // "Calambres nocturnos",  // 1
    // "Callos clavos",  // 1
    // "Candidiasis intertriginosa",  // 1
    // "Caput succedaneum",  // 1
    // "Carbunco cutáneo",  // 1
    // "Carcinoma Adrenal",  // 1
    // "Carcinoma posterior de la lengua",  // 1
    // "Carcinomas broncopulmonares no microcíticos",  // 1
    // "Carencia del factor intrínseco",  // 1
    // "Cayado aórtico doble",  // 1
    // "Cicatrices inestéticas",  // 1
    // "Ciclotimia",  // 1
    // "Cigomicosis",  // 1
    // "Cisticercosis",  // 1
    // "Cistinuria",  // 1
    // "Cistitis abacteriana",  // 1
    // "Cistitis química",  // 1
    // "Coagulación intravascular diseminada (CID)",  // 1
    // "Coartación de la aorta",  // 1
    // "Coccidioidomicosis pulmonar crónica",  // 1
    // "Codependencia emocional y heridas de infancia",  // 1
    // "Colapso pulmonar espontáneo",  // 1
    // "Colitis asociada con antibióticos",  // 1
    // "Coma hepático",  // 1
    // "Condromalacia patelar",  // 1
    // "Congestión mamaria",  // 1
    // "Conmoción cerebral",  // 1
    // "Consumo excesivo de alcohol",  // 1
    // "Convulsión de tipo gran mal",  // 1
    // "Coproporfiria hereditaria",  // 1
    // "Covid crónico",  // 1
    // "Criohemoglobinuria paroxística",  // 1
    // "Crisis addisoniana",  // 1
    // "Crisis de gran mal",  // 1
    // "Crisis suprarrenal",  // 1
    // "Crisis suprarrenal aguda",  // 1
    // "Crisis tirotóxica",  // 1
    // "Cáncer de ano",  // 1
    // "Cáncer de cérvix",  // 1
    // "Cáncer de páncreas",  // 1
    // "Cáncer de retina",  // 1
    // "Cáncer pulmón",  // 1
    // "Cáncer páncreas",  // 1
    // "DEPRESION",  // 1
    // "DFM",  // 1
    // "DILV (ventrículo izquierdo con doble entrada)",  // 1
    // "DOLOR ABDOMINAL",  // 1
    // "DOLOR DE ESPALDA",  // 1
    // "DOLOR DE ESTOMAGO",  // 1
    // "DOLOR DE NERVIO CIATICO",  // 1
    // "DORSALGIA",  // 1
    // "DORV",  // 1
    // "DORV con comunicación interventricular doblemente comprometida",  // 1
    // "DORV con comunicación interventricular no comprometida",  // 1
    // "DORV con comunicación interventricular subaórtica",  // 1
    // "DSD",  // 1
    // "DVT",  // 1
    // "Defecto del relieve endocárdico",  // 1
    // "Deficiencia de 21-hidroxilasa",  // 1
    // "Deficiencia de IgA",  // 1
    // "Deficiencia de Stuart-Prower",  // 1
    // "Deficiencia de alfa-1 antitripsina",  // 1
    // "Deficiencia de beta galactosidasa",  // 1
    // "Deficiencia de factor X",  // 1
    // "Deficiencia de folato",  // 1
    // "Deficiencia de glucosa -6- fosfato deshidrogenasa",  // 1
    // "Deficiencia de gonadotropina",  // 1
    // "Deficiencia de lactasa",  // 1
    // "Deficiencia de miofosforilasa",  // 1
    // "Deficiencia de protrombina",  // 1
    // "Deficiencia de reductasa en eritrocitos",  // 1
    // "Deficiencia de ácido fólico",  // 1
    // "Deficiencia del factor II",  // 1
    // "Deficiencia del factor V",  // 1
    // "Deficiencia del factor VII",  // 1
    // "Deficiencia del factor XII (factor de Hageman)",  // 1
    // "Deficiencia del factor extrínseco",  // 1
    // "Deficiencia selectiva de lgA",  // 1
    // "Degeneración hepatocerebral crónica adquirida (no Wilsoniana)",  // 1
    // "Degeneración hepatolenticular",  // 1
    // "Degeneración olivopontocerebelosa",  // 1
    // "Delirium tremens",  // 1
    // "Demencia de origen metabólico",  // 1
    // "Demencia de tipo semántica",  // 1
    // "Derivación cardíaca de derecha a izquierda",  // 1
    // "Derivación circulatoria de derecha a izquierda",  // 1
    // "Dermatitis asteatótica (eccema craquelé)",  // 1
    // "Dermatitis numular",  // 1
    // "Dermatofítide",  // 1
    // "Desequilibrio hormonal",  // 1
    // "Desnutrición proteica",  // 1
    // "Despigmentación",  // 1
    // "Dextroposición",  // 1
    // "Dextrorrotación",  // 1
    // "Dextroversión",  // 1
    // "Diaforesis",  // 1
    // "Diarrea infecciosa por Campylobacter",  // 1
    // "Dietoterapia y código de menús de dietas en enfermedades",  // 1
    // "Discrasias",  // 1
    // "Discólisis percutánea",  // 1
    // "Disentería amebiana",  // 1
    // "Disfagia sideropénica",  // 1
    // "Disfunción del nervio ciático",  // 1
    // "Disfunción del nervio mediano",  // 1
    // "Disminución de la perfusión renal",  // 1
    // "Disostosis cleidocraneal",  // 1
    // "Displasia de Streeter",  // 1
    // "Displasia fibromuscular (DFM)",  // 1
    // "Dispraxia",  // 1
    // "Distrofia muscular de cintura escapulohumeral o pélvica (LGMD)",  // 1
    // "Distrofia muscular facioescapulohumeral",  // 1
    // "Diuresis osmótica",  // 1
    // "Doble entrada ventricular izquierda",  // 1
    // "Doble salida ventricular derecha",  // 1
    // "Dolor Neuropático",  // 1
    // "Dolor de cabeza histamínico",  // 1
    // "Dolor de cara",  // 1
    // "Dolor de cintura",  // 1
    // "Dolor en nervio ciático",  // 1
    // "Dolor lumbar",  // 1
    // "Dolor por herpes zoster",  // 1
    // "Dolor posterior a amputación",  // 1
    // "Dolor posterior a cirugía en columna",  // 1
    // "EAG",  // 1
    // "EGC",  // 1
    // "EGH",  // 1
    // "EMH",  // 1
    // "ENFERMEDAD POR REFLUJO GASTROESOFAGICO",  // 1
    // "Eccema seborreico",  // 1
    // "Edema por insuficiencia venosa crónica",  // 1
    // "Ehrlichiosis granulocítica humana",  // 1
    // "Ehrlichiosis monocítica humana",  // 1
    // "Eliptocitosis hereditaria",  // 1
    // "Embolia arterial renal",  // 1
    // "Empiema",  // 1
    // "Encefalopatía Alcohólica",  // 1
    // "Endocarditis de cultivo negativo",  // 1
    // "Enfermedad Poliquística Renal",  // 1
    // "Enfermedad biliar",  // 1
    // "Enfermedad de Berger",  // 1
    // "Enfermedad de Brill-Zinsser",  // 1
    // "Enfermedad de Buerger",  // 1
    // "Enfermedad de Charcot-Marie-Tooth",  // 1
    // "Enfermedad de Christmas",  // 1
    // "Enfermedad de Gaucher",  // 1
    // "Enfermedad de Gilchrist",  // 1
    // "Enfermedad de Glanzmann",  // 1
    // "Enfermedad de Hansen",  // 1
    // "Enfermedad de Kawasaki",  // 1
    // "Enfermedad de Kimmelstiel-Wilson",  // 1
    // "Enfermedad de Lyme en etapa 2",  // 1
    // "Enfermedad de Niemann-Pick",  // 1
    // "Enfermedad de Ohara",  // 1
    // "Enfermedad de Ormond",  // 1
    // "Enfermedad de Ritter",  // 1
    // "Enfermedad de la Bahía de Minamata",  // 1
    // "Enfermedad de la hemoglobina C",  // 1
    // "Enfermedad de la hemoglobina M",  // 1
    // "Enfermedad de la hemoglobina SS (Hb SS)",  // 1
    // "Enfermedad de la mama",  // 1
    // "Enfermedad de las motoneuronas altas y bajas",  // 1
    // "Enfermedad de los depósitos densos",  // 1
    // "Enfermedad del abdomen",  // 1
    // "Enfermedad del cabello ensortijado",  // 1
    // "Enfermedad del hígado",  // 1
    // "Enfermedad granulomatosa crónica",  // 1
    // "Enfermedad granulomatosa crónica de la infancia",  // 1
    // "Enfermedad hepática alcohólica",  // 1
    // "Enfermedad hidatídica",  // 1
    // "Enfermedad humana por adyuvantes",  // 1
    // "Enfermedad por defecto de almacenamiento intraplaquetario",  // 1
    // "Enfermedad por depósitos de dihidrato de pirofosfato cálcico",  // 1
    // "Enfermedad pulmonar",  // 1
    // "Enfermedad pulmonar asociada a artritis reumatoidea",  // 1
    // "Enfermedad pulmonar inducida por medicamentos",  // 1
    // "Enfermedad pulmonar reumatoidea",  // 1
    // "Enfermedad reumatoidea del colágeno",  // 1
    // "Enfermedad sin pulso",  // 1
    // "Enfermedad vascular del colágeno",  // 1
    // "Enfermedades de vejiga",  // 1
    // "Enfermedades del sistema nervioso central",  // 1
    // "Enteropatía perdedora de proteínas",  // 1
    // "Envenenamiento con etilenglicol",  // 1
    // "Envenenamiento por hongos",  // 1
    // "Envenenamiento por plantas tóxicas",  // 1
    // "Ependimoma en adultos",  // 1
    // "Eritema artrítico epidémico",  // 1
    // "Eritema nodoso",  // 1
    // "Eritremia",  // 1
    // "Eritrocitosis megaloesplénica",  // 1
    // "Eritroplasia de Queyrat",  // 1
    // "Esclerosis",  // 1
    // "Esotropía",  // 1
    // "Espasmo de las arterias coronarias",  // 1
    // "Espermatocele",  // 1
    // "Espondilitis reumatoidea",  // 1
    // "Esporotricosis",  // 1
    // "Esquizofrenia paranoide",  // 1
    // "Estado de confusión aguda",  // 1
    // "Estados tromboembólicos",  // 1
    // "Estancamiento personal",  // 1
    // "Estenosis meatal",  // 1
    // "Estenosis pilórica hipertrófica congénita",  // 1
    // "Estenosis traqueal",  // 1
    // "Estrabismo divergente",  // 1
    // "Exotropía",  // 1
    // "FIEBRE",  // 1
    // "FV",  // 1
    // "Fibrinólisis",  // 1
    // "Fibrinólisis primaria o secundaria",  // 1
    // "Fibroma pleural",  // 1
    // "Fibrosis hepática",  // 1
    // "Fibrosis retroperitoneal",  // 1
    // "Fibrosis retroperitoneal idiopática",  // 1
    // "Fiebre amarilla",  // 1
    // "Fiebre biduoterciana",  // 1
    // "Fiebre cuartana",  // 1
    // "Fiebre de las aguas negras o de los pantanos",  // 1
    // "Fiebre del heno",  // 1
    // "Fiebre del valle del río Ohio",  // 1
    // "Fiebre maculosa de las Montañas Rocosas",  // 1
    // "Fiebre por mordedura de rata",  // 1
    // "Fiebre reumática",  // 1
    // "Fiebre reumática aguda",  // 1
    // "Fisiología de Eisenmenger",  // 1
    // "Flegmasía alba dolorosa",  // 1
    // "Flegmasía cerúlea dolorosa",  // 1
    // "Fosfato bajo en sangre",  // 1
    // "Fosfeno",  // 1
    // "Fuga del LCR",  // 1
    // "GASTRITIS",  // 1
    // "Galactosemia",  // 1
    // "Ganglioneuroblastoma",  // 1
    // "Ganglioneuroma",  // 1
    // "Gangrena de Fournier (Síndrome de Fournier)",  // 1
    // "Giardia",  // 1
    // "Gigantismo",  // 1
    // "Glioblastoma",  // 1
    // "Glioblastoma Multiforme",  // 1
    // "Glioblastoma multiforme en adultos",  // 1
    // "Glioma",  // 1
    // "Glomeruloesclerosis segmentaria",  // 1
    // "Glomerulonefritis membranoproliferativa (tipo I)",  // 1
    // "Glomerulonefritis membranoproliferativa (tipo II)",  // 1
    // "Glomerulonefritis membranosa",  // 1
    // "Glomerulonefritis rápidamente progresiva con hemorragia pulmonar",  // 1
    // "Glucagonoma",  // 1
    // "Glándulas de Tyson",  // 1
    // "Golondrino",  // 1
    // "Granos",  // 1
    // "Granulocitopenia",  // 1
    // "Granulopenia",  // 1
    // "HCL",  // 1
    // "HCM",  // 1
    // "HMD",  // 1
    // "HOCM",  // 1
    // "HOMBRO DOLOROSO",  // 1
    // "HPP",  // 1
    // "Helomas",  // 1
    // "Hemangioma capilar congénito o nevo flamígero",  // 1
    // "Hemangioma capilar lobular",  // 1
    // "Hemangioma fresa",  // 1
    // "Hemangiomatosis hepática multinodular",  // 1
    // "Hematoma del riñón",  // 1
    // "Hemoglobina clínica C",  // 1
    // "Hemoglobinopatías raras",  // 1
    // "Hemorragia extradural",  // 1
    // "Hemorragia intracerebral hipertensiva",  // 1
    // "Hemorragia subdural crónica",  // 1
    // "Hepatitis inducida por medicamentos",  // 1
    // "Hepatitis lupoide",  // 1
    // "Heridas de difícil cicatrización",  // 1
    // "Hernia Uncal",  // 1
    // "Hernia amigdalina",  // 1
    // "Hernia femoral",  // 1
    // "Hernia subfalcial",  // 1
    // "Hernias",  // 1
    // "Herpes adquirido al nacer",  // 1
    // "Hidatidosis",  // 1
    // "Hidropesía endolinfática",  // 1
    // "Hiperaldosteronismo primario y secundario",  // 1
    // "Hipercaliemia",  // 1
    // "Hipercinesia en la niñez",  // 1
    // "Hipercortisolismo",  // 1
    // "Hiperemesis gravídica",  // 1
    // "Hiperhidrosis axilar",  // 1
    // "Hiperhidrosis craneofacial",  // 1
    // "Hiperhidrosis facial",  // 1
    // "Hiperhidrosis palmar",  // 1
    // "Hiperlipidemia combinada familiar",  // 1
    // "Hiperlipoproteinemia tipo I",  // 1
    // "Hiperlipoproteinemia tipo II",  // 1
    // "Hiperlipoproteinemia tipo III",  // 1
    // "Hiperpirexia maligna",  // 1
    // "Hiperplasia linfofolicular",  // 1
    // "Hiperplasia linfoide",  // 1
    // "Hiperreflexia autónoma",  // 1
    // "Hiperreflexia del detrusor",  // 1
    // "Hiperserotoninemia",  // 1
    // "Hipersomnia idiopática",  // 1
    // "Hipertensión intracraneal benigna",  // 1
    // "Hipertensión intracraneal idiopática",  // 1
    // "Hipertensión pulmonar primaria esporádica",  // 1
    // "Hipertensión pulmonar primaria familiar",  // 1
    // "Hipertiroidismo congénito",  // 1
    // "Hipertiroidismo provocado",  // 1
    // "Hipertrofia de cartílago de la concha auricular",  // 1
    // "Hipertrofia del tabique asimétrico",  // 1
    // "Hipertrofia linfofolicular",  // 1
    // "Hipertrofia linfoide",  // 1
    // "Hipervitaminosis D",  // 1
    // "Hipoacusia neurosensorial en los bebés",  // 1
    // "Hipoacusia ocupacional",  // 1
    // "Hipofunción corticosuprarrenal",  // 1
    // "Hipoglucemia neonatal",  // 1
    // "Hipogonadismo Primario y Secundario en Hombres",  // 1
    // "Hipomagnesemia",  // 1
    // "Hipomelanosis de Ito",  // 1
    // "Hiponatremia euvolémica",  // 1
    // "Hiponatremia hipervolémica",  // 1
    // "Hiponatremia hipovolémica",  // 1
    // "Hiponatremia por dilución",  // 1
    // "Hipoprotrombinemia",  // 1
    // "Hipotermia",  // 1
    // "Hipotiroidismo central",  // 1
    // "Hipotiroidismo primario",  // 1
    // "Hipotiroidismo secundario",  // 1
    // "Hipoxia cerebral",  // 1
    // "Histiocitosis X",  // 1
    // "Histoplasmosis diseminada",  // 1
    // "Huevo de Naboth",  // 1
    // "Huntington",  // 1
    // "IHSS",  // 1
    // "INSUFICIENCIA HEPATICA",  // 1
    // "IUGR",  // 1
    // "Ictericia familiar no hemolítica - no obstructiva",  // 1
    // "Ictiosis común",  // 1
    // "Ideación suicida",  // 1
    // "Impactación del oído",  // 1
    // "Incidentaloma de tiroides",  // 1
    // "Inconformidad Estética Facial",  // 1
    // "Incontinencia",  // 1
    // "Incontinencia pigmentaria",  // 1
    // "Inestabilidad del detrusor",  // 1
    // "Infarto esplénico",  // 1
    // "Infecciones Recurrentes de vías respiratorias",  // 1
    // "Infecciones de los pies",  // 1
    // "Infección aguda por citomegalovirus",  // 1
    // "Infección de los tejidos por clostridio",  // 1
    // "Infección de piel por estafilococo",  // 1
    // "Infección del cuero cabelludo",  // 1
    // "Infección del oído interno",  // 1
    // "Infección en el cuero cabelludo por hongos",  // 1
    // "Infección estafilocócica de piel",  // 1
    // "Infección por nocardia",  // 1
    // "Infección vesical en adultos",  // 1
    // "Infiltrados pulmonares con eosinofilia",  // 1
    // "Inflamación de la esclerótica",  // 1
    // "Inflamación del músculo cardíaco",  // 1
    // "Inmunodepresión",  // 1
    // "Insuficiencia corticosuprarrenal crónica",  // 1
    // "Insuficiencia hipofisaria",  // 1
    // "Insuficiencia hipofisaria después del parto",  // 1
    // "Insuficiencia renal en estado terminal",  // 1
    // "Insuficiencia renal por obstrucción crónica",  // 1
    // "Insuficiencia suprarrenal aguda",  // 1
    // "Insuficiencia suprarrenal primaria",  // 1
    // "Insuficiencia testicular",  // 1
    // "Insuficiencia vertebrobasilar",  // 1
    // "Interrupción legal del embarazo",  // 1
    // "Intolerancia hereditaria a la fructosa",  // 1
    // "Intoxicación con barbitúricos",  // 1
    // "Intoxicación por cáusticos",  // 1
    // "Intoxicación por digitálicos",  // 1
    // "Intoxicación por opiáceos",  // 1
    // "Intoxicación por plaguicidas",  // 1
    // "Intoxicación simpaticomimética",  // 1
    // "Intubación nasogástrica o endotraqueal traumática",  // 1
    // "Isquemia de circulación posterior",  // 1
    // "Kernicterus",  // 1
    // "Kwashiorkor",  // 1
    // "LES",  // 1
    // "LGV",  // 1
    // "Laberintitis bacteriana",  // 1
    // "Laminectomía en puerta francesa",  // 1
    // "Leptospirosis",  // 1
    // "Lesiones Neurológicas",  // 1
    // "Lesiones Ortopédicas",  // 1
    // "Lesiones Post Operatorias",  // 1
    // "Lesiones musculares",  // 1
    // "Lesión cervical",  // 1
    // "Lesión cutánea de coccidioidomicosis",  // 1
    // "Lesión de Meniscos",  // 1
    // "Lesión del sacro",  // 1
    // "Lesión en el intestino delgado inducida por radiación",  // 1
    // "Lesión en espalda",  // 1
    // "Leucoencefalitis esclerosante subaguda",  // 1
    // "Leucoencefalopatía multifocal progresiva",  // 1
    // "Leucomalacia periventricular",  // 1
    // "Leucoplasia",  // 1
    // "Leucoplasia vellosa",  // 1
    // "Linfadenitis",  // 1
    // "Linfangioma",  // 1
    // "Linfangitis",  // 1
    // "Linfoma mediastinal",  // 1
    // "Lipogranuloma de la glándula de Meibomio",  // 1
    // "Livedo reticularis",  // 1
    // "Livedo reticularis primaria o idiopática",  // 1
    // "Láser Co2 para tensado vaginal (monalisa)",  // 1
    // "Líquido pleural",  // 1
    // "MAV cerebral",  // 1
    // "Malformaciones del tórax y esternón",  // 1
    // "Megarrecto",  // 1
    // "Melanoma del ojo",  // 1
    // "Meningococemia",  // 1
    // "Mesotelioma fibroso",  // 1
    // "Mesotelioma maligno",  // 1
    // "Metahemoglobinemia",  // 1
    // "Metahemoglobinemia adquirida",  // 1
    // "Metaplasia mielocitoide agnógena",  // 1
    // "Metaplasia mieloide",  // 1
    // "Metástasis cerebral",  // 1
    // "Metástasis cerebrales",  // 1
    // "Metástasis de hígado",  // 1
    // "Metástasis vertebrales",  // 1
    // "Microtia",  // 1
    // "Migraña vestibular",  // 1
    // "Miocardiopatía alcohólica",  // 1
    // "Miocardiopatía obstructiva hipertrófica",  // 1
    // "Mononeuropatía del IX par craneal o nervio glosofaríngeo",  // 1
    // "Mononeuropatía del VII par craneal",  // 1
    // "Mononeuropatía múltiple",  // 1
    // "Monorquidia",  // 1
    // "Muerte en la cuna",  // 1
    // "Multiplicación excesiva de bacterias intestinales",  // 1
    // "Mutación en el receptor de lipoproteína de baja densidad",  // 1
    // "NEURALGIA DEL TRIGEMINO",  // 1
    // "NF1",  // 1
    // "Necrosis renal tubular",  // 1
    // "Nefritis intersticial",  // 1
    // "Nefritis intersticial aguda no relacionada con AINES",  // 1
    // "Nefroblastoma",  // 1
    // "Nefropatía debida al reflujo",  // 1
    // "Nefropatía por analgésicos",  // 1
    // "Neoplasia endocrina múltiple (NEM) II",  // 1
    // "Neumonitis intersticial por exposición al asbesto",  // 1
    // "Neumonía por Pneumocystis carinii",  // 1
    // "Neumonía por micoplasma",  // 1
    // "Neuralgia migrañosa",  // 1
    // "Neuralgia trigeminal",  // 1
    // "Neuritis de tipo periférico",  // 1
    // "Neurofibromatosis acústica bilateral",  // 1
    // "Neuroglioma en adultos",  // 1
    // "Neurolaberintitis viral",  // 1
    // "Neuropatía del plexo braquial",  // 1
    // "Neuropatía facial",  // 1
    // "Neuropatía multifocal",  // 1
    // "Neuropatía secundaria a medicamentos",  // 1
    // "Neutropenia en los bebés",  // 1
    // "Nevo en calzón de baño",  // 1
    // "Nevo sebáceo",  // 1
    // "Niveles bajos de magnesio",  // 1
    // "Nocardiosis",  // 1
    // "Nódulos reumatoideos",  // 1
    // "Obstrucción de la UUP",  // 1
    // "Obstrucción de la vena hepática (Budd-Chiari)",  // 1
    // "Obstrucción del conducto de salida ventricular izquierdo",  // 1
    // "Obstrucción linfática",  // 1
    // "Oclusión de la arteria renal",  // 1
    // "Ocronosis alcaptonúrica",  // 1
    // "Oligodendroglioma en niños",  // 1
    // "Origen anómalo de la arteria coronaria izquierda que sale de la arteria pulmonar",  // 1
    // "Osteodistrofia hereditaria de Albright",  // 1
    // "Osteítis deformante",  // 1
    // "Osteítis fibroquística",  // 1
    // "Osteítis fibrosa",  // 1
    // "Otitis media asintomática",  // 1
    // "Otitis media secretora",  // 1
    // "Oxiuriasis",  // 1
    // "PA/IVS",  // 1
    // "PAD",  // 1
    // "PCH",  // 1
    // "PIC",  // 1
    // "PVB",  // 1
    // "PVC",  // 1
    // "Paludismo terciano",  // 1
    // "Panencefalitis esclerosante subaguda",  // 1
    // "Paperas",  // 1
    // "Papilomas cutáneos",  // 1
    // "Parvovirus B19",  // 1
    // "Parálisis del VII nervio craneal",  // 1
    // "Parálisis del tercer nervio craneal en diabéticos",  // 1
    // "Parálisis infantil",  // 1
    // "Perfilamiento Facial",  // 1
    // "Pericarditis bacteriana",  // 1
    // "Pericarditis por constricción cardíaca",  // 1
    // "Pericarditis poscardiotomía",  // 1
    // "Pericarditis purulenta",  // 1
    // "Permeabilidad de la trompa de Eustaquio",  // 1
    // "Personalidad adolescente",  // 1
    // "Personalidad sociopática",  // 1
    // "Peste de Pahvant Valley",  // 1
    // "Peste pulmonar",  // 1
    // "Peste septicémica",  // 1
    // "Petrositis",  // 1
    // "Pica",  // 1
    // "Picaduras de alacrán",  // 1
    // "Picky eater",  // 1
    // "Pielonefritis Aguda",  // 1
    // "Pielonefritis Aguda Enfisematosa",  // 1
    // "Pieloxantogranulomatosis",  // 1
    // "Pitiriasis alba",  // 1
    // "Plasmodio",  // 1
    // "Pleuritis",  // 1
    // "Pneumoconiosis",  // 1
    // "Pneumocystis jiroveci",  // 1
    // "Pneumonía anaeróbica",  // 1
    // "Poliarteritis infantil",  // 1
    // "Policitemia esplenomegálica",  // 1
    // "Policromatofilia",  // 1
    // "Polineuritis idiopática aguda",  // 1
    // "Poliomielitis",  // 1
    // "Poliserositis familiar recurrente",  // 1
    // "Porfiria",  // 1
    // "Porfiria aguda intermitente",  // 1
    // "Porfiria eritropoyética congénita",  // 1
    // "Post covid",  // 1
    // "Prematurez",  // 1
    // "Problemas de atención",  // 1
    // "Problemas de deglución",  // 1
    // "Problemas de lenguaje",  // 1
    // "Problemas de memoria en adultos mayores",  // 1
    // "Proceso vaginal persistente",  // 1
    // "Prolactinoma en las mujeres",  // 1
    // "Prolactinoma en los hombres",  // 1
    // "Prolapso de la válvula aórtica",  // 1
    // "Proliferación excesiva de bacterias en el intestino delgado",  // 1
    // "Psoriasis guttata",  // 1
    // "Pulmón en shock",  // 1
    // "Páncreas divisum",  // 1
    // "Queratosis obturante",  // 1
    // "Queratosis senil",  // 1
    // "Quilomicronemia familiar",  // 1
    // "Rabia",  // 1
    // "Radiculopatías",  // 1
    // "Raquitismo renal",  // 1
    // "Reacción de Eisenmenger",  // 1
    // "Rechazo a un órgano o tejido",  // 1
    // "Regurgitación aórtica",  // 1
    // "Regurgitación tricuspídea",  // 1
    // "Retardo mental",  // 1
    // "Retención de líquido pulmonar fetal",  // 1
    // "Reticuloendoteliosis leucémica",  // 1
    // "Retinitis por citomegalovirus",  // 1
    // "Retorno venoso pulmonar anómalo total (TAPVR)",  // 1
    // "Retrodesviación uterina",  // 1
    // "Rosácea fimatosa",  // 1
    // "Ruptura bronquial o traqueal",  // 1
    // "Ruptura del tímpano",  // 1
    // "Ránula",  // 1
    // "SCD",  // 1
    // "SCIH",  // 1
    // "SDR transitorio",  // 1
    // "Salud del adolescente",  // 1
    // "Salud mental en el embarazo",  // 1
    // "Sarcoma botrioides",  // 1
    // "Sarcoma osteógeno",  // 1
    // "Sarcoma retroperitoneal",  // 1
    // "Sarcoma sinovial",  // 1
    // "Sarcomas de extremidades",  // 1
    // "Schwannoma vestibular",  // 1
    // "Secuelas de infarto agudo al miocardio",  // 1
    // "Secuelas de parálisis facial",  // 1
    // "Seno o fístula de la hendidura branquial",  // 1
    // "Sensibilidad autoeritrocítica",  // 1
    // "Septicemia",  // 1
    // "Septicemia meningocócica",  // 1
    // "Shock endotóxico",  // 1
    // "Sibilancias recurrentes",  // 1
    // "Silicosis",  // 1
    // "Sindrome de salida torácica",  // 1
    // "Sindrome del niño golpeado",  // 1
    // "Sinovitis transitoria",  // 1
    // "Sobredosis de medicamentos",  // 1
    // "Sordera parcial en bebés",  // 1
    // "Staphylococcus aureus resistente a meticilina",  // 1
    // "Suelo pélvico masculino y femenino",  // 1
    // "Síndrome Facetario",  // 1
    // "Síndrome Psicorgánico",  // 1
    // "Síndrome de 5p menos",  // 1
    // "Síndrome de ALCAPA",  // 1
    // "Síndrome de Aase-Smith",  // 1
    // "Síndrome de Alport",  // 1
    // "Síndrome de Arias (Crigler-Najjar tipo II)",  // 1
    // "Síndrome de Barlow",  // 1
    // "Síndrome de Bernard-Soulier",  // 1
    // "Síndrome de Bland-White-Garland",  // 1
    // "Síndrome de Briquet",  // 1
    // "Síndrome de Caplan",  // 1
    // "Síndrome de Crigler-Najjar",  // 1
    // "Síndrome de Cushing debido a un tumor suprarrenal",  // 1
    // "Síndrome de Cushing ectópico",  // 1
    // "Síndrome de Cushing inducido por corticosteroides",  // 1
    // "Síndrome de Edwards",  // 1
    // "Síndrome de Gianotti-Crosti",  // 1
    // "Síndrome de Goodpasture",  // 1
    // "Síndrome de Guillain Barré",  // 1
    // "Síndrome de Heller",  // 1
    // "Síndrome de Hutchinson-Gilford",  // 1
    // "Síndrome de Kallmann",  // 1
    // "Síndrome de Klinefelter",  // 1
    // "Síndrome de Klippel-Trenaunay",  // 1
    // "Síndrome de Klippel-Trenaunay-Weber",  // 1
    // "Síndrome de Loeffler",  // 1
    // "Síndrome de Martin-Bell",  // 1
    // "Síndrome de Munchausen por poderes",  // 1
    // "Síndrome de Patau",  // 1
    // "Síndrome de Pierre Robin",  // 1
    // "Síndrome de Potter",  // 1
    // "Síndrome de Rubinstein-Taybi",  // 1
    // "Síndrome de Shy-McGee-Drager",  // 1
    // "Síndrome de Silver",  // 1
    // "Síndrome de Stein-Leventhal",  // 1
    // "Síndrome de Turner",  // 1
    // "Síndrome de Waterhouse-Friderichsen",  // 1
    // "Síndrome de alcoholismo fetal",  // 1
    // "Síndrome de clic-soplo sistólico",  // 1
    // "Síndrome de disfunción inmunitaria",  // 1
    // "Síndrome de herniación",  // 1
    // "Síndrome de hiperinmunoglobulina E",  // 1
    // "Síndrome de insensibilidad a los andrógenos",  // 1
    // "Síndrome de insensibilidad parcial a los andrógenos",  // 1
    // "Síndrome de la abertura torácica superior",  // 1
    // "Síndrome de la válvula pulmonar ausente",  // 1
    // "Síndrome de las piernas inquietas",  // 1
    // "Síndrome de lesión cardíaca posterior",  // 1
    // "Síndrome de los ganglios linfáticos mucocutáneos",  // 1
    // "Síndrome de muerte súbita del lactante",  // 1
    // "Síndrome de nefritis aguda",  // 1
    // "Síndrome de preexcitación",  // 1
    // "Síndrome de quilomicronemia",  // 1
    // "Síndrome de respuesta inflamatoria sistémica (SRIS)",  // 1
    // "Síndrome de shock tóxico",  // 1
    // "Síndrome de supresión del cromosoma 5p",  // 1
    // "Síndrome del Caballero Blanco",  // 1
    // "Síndrome del cabello acerado",  // 1
    // "Síndrome del corazón izquierdo hipoplásico",  // 1
    // "Síndrome del cromosoma X frágil",  // 1
    // "Síndrome del marcador X",  // 1
    // "Síndrome del robo de la subclavia",  // 1
    // "Síndrome del shock tóxico por estafilococos",  // 1
    // "Síndrome nefrótico congénito",  // 1
    // "Síndrome oculoglandular",  // 1
    // "Síndrome orgánico cerebral",  // 1
    // "Síndrome pos-esplenectomía",  // 1
    // "Síndrome uretral",  // 1
    // "Síndrome uretral agudo",  // 1
    // "TC Abdomen contrastado",  // 1
    // "TC Abdomen simple",  // 1
    // "TC Tórax contrastado",  // 1
    // "TC Tórax simple",  // 1
    // "TET",  // 1
    // "TSVP",  // 1
    // "TVP",  // 1
    // "Tabes dorsal",  // 1
    // "Tenia solitaria",  // 1
    // "Teratoma inmaduro",  // 1
    // "Teratoma maligno",  // 1
    // "Tics faciales",  // 1
    // "Tiroides retroesternal",  // 1
    // "Tiroiditis crónica (Enfermedad de Hashimoto)",  // 1
    // "Tiroiditis de células gigantes",  // 1
    // "Tiroiditis granulomatosa subaguda",  // 1
    // "Tiroiditis indolora",  // 1
    // "Tiroiditis silenciosa",  // 1
    // "Tirotoxicosis medicamentosa",  // 1
    // "Tiña de la cabeza",  // 1
    // "Tos o expectoracion con sangre ( hemoptisis)",  // 1
    // "Toxemia con convulsiones",  // 1
    // "Toxemia menigocócica",  // 1
    // "Transexualismo",  // 1
    // "Transposición de los grandes vasos",  // 1
    // "Traqueítis bacteriana",  // 1
    // "Trastorno crónico de tic vocal",  // 1
    // "Trastorno del déficit de atención e hiperactividad (TDAH)",  // 1
    // "Trastorno disociativo de la infancia",  // 1
    // "Trastorno mental orgánico",  // 1
    // "Trastornos autoinmunitarios",  // 1
    // "Trastornos circulatorios",  // 1
    // "Trastornos circulatorios vertebrobasilares",  // 1
    // "Trastornos de alimentación",  // 1
    // "Trastornos de la alimentación (bulimia, anorexia)",  // 1
    // "Trastornos de la deglución",  // 1
    // "Trastornos de síntomas somáticos",  // 1
    // "Trastornos del climaterio y menopausia",  // 1
    // "Trastornos del espectro",  // 1
    // "Trastornos en el desarrollo de la vagina y vulva",  // 1
    // "Trastornos en el desarrollo del aparato reproductor femenino",  // 1
    // "Traumatismo craneoencefálico (TCE)",  // 1
    // "Trombastenia",  // 1
    // "Tromboangeítis obliterante",  // 1
    // "Trombosis del seno cavernoso",  // 1
    // "Tronco",  // 1
    // "Tronco arterial",  // 1
    // "Tuberculosis diseminada",  // 1
    // "Tuberculosis extrapulmonar",  // 1
    // "Tumor cerebral cancerígeno primario en adultos",  // 1
    // "Tumor de células de los islotes o tumor de células insulares",  // 1
    // "Tumor de retina",  // 1
    // "Tumor fibroso localizado de la pleura",  // 1
    // "Tumor mediastinal",  // 1
    // "Tumores cerebrales",  // 1
    // "Técnicas de prevención de enfermedades",  // 1
    // "Tétanos",  // 1
    // "Ulceras de diabetico",  // 1
    // "Ultrasonido endovaginal",  // 1
    // "Uropatía obstructiva aguda bilateral",  // 1
    // "Uropatía obstructiva unilateral crónica",  // 1
    // "Urticaria pigmentosa",  // 1
    // "Uveítis posterior",  // 1
    // "Uñas rnterradas",  // 1
    // "VKDB",  // 1
    // "Vaginitis moniliásica",  // 1
    // "Valoración por COVID 19",  // 1
    // "Vasculitis de tipo necrosante",  // 1
    // "Vasculitis leucocitoclástica cutánea",  // 1
    // "Vasculitis sistémica",  // 1
    // "Vasculopatía mesentérica",  // 1
    // "Ventana aortopulmonar",  // 1
    // "Ventrículo común",  // 1
    // "Verrugas subungueales",  // 1
    // "Vipoma",  // 1
    // "Viruela",  // 1
    // "Virus del Nilo Occidental",  // 1
    // "Válvula aórtica bicomisural",  // 1
    // "Vénulas",  // 1
    // "Vómitos persistentes en el embarazo",  // 1
    // "WPW",  // 1
    // "Xantelasma",  // 1
    // "Xantomatosis hipercolesterolémica",  // 1
    // "Xerodermia pigmentosa",  // 1
    // "Xeroftalmia",  // 1
    // "Xerosis",  // 1
    // "Ántrax múltiple",  // 1
    // "Émbolo",  // 1
    // "Úlcera aftosa"  // 1
  ]
  // ---------------------- Filter Logic ----------------------
// ---------------------- Filter Logic ----------------------
   // ---------------------- Filter Logic ----------------------
  const filteredCities = useMemo(() => {
    if (!cityQuery) return []
    return ciudades.filter((c) =>
      c.label.toLowerCase().includes(cityQuery.toLowerCase())
    )
  }, [cityQuery])

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
          /buscar?ciudad=${encodeURIComponent(
            selectedCity.value
          )}&tipo=${searchBy}&valor=${encodeURIComponent(
            selectedOption.value
          )}
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
      className={bg-card rounded-lg shadow-sm p-4 mx-auto w-full max-w-screen-xl ${className}}
    >
      <div className="flex flex-col gap-3 items-stretch md:flex-row md:justify-center md:items-end">
        {/* ─────────── Ciudad Combobox ─────────── */}
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

        {/* ─────────── Buscar por Selector ─────────── */}
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

        {/* ─────────── Especialidad/Padecimiento Combobox ─────────── */}
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
                placeholder={Escribe para buscar ${searchBy}}
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

        {/* ─────────── Botón “Buscar” ─────────── */}
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