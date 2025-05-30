"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Static data for featured sections
const FEATURED_DATA = {
  especialidades: [
    "Psicología",  // 946
    "Odontología",  // 873
    "Ginecología y Obstetricia",  // 816
    "Pediatría",  // 738
    "Medicina General",  // 528
    "Medicina Interna",  // 474
    "Ortopedia y Traumatología",  // 400
    "Oftalmología",  // 262
    "Psiquiatría",  // 220
    "Dermatología",  // 185
    "Nutrición y Dietética",  // 168
    "Anestesiología",  // 166
    "Otorrinolaringología",  // 154
    "Neonatología",  // 143
    "Urología",  // 142
    "Medicina Estética y Reconstructiva",  // 137
    "Laboratorio Clínico",  // 106
    "Gastroenterología",  // 105
    "Cirugía General",  // 82
    "Neurocirugía",  // 75
    "Neumología",  // 72
    "Medicina Familiar",  // 68
    "Geriatría",  // 63
    "Alergología",  // 61
    "Radiología y Diagnóstico por Imagen",  // 61
    "Cirugía Pediátrica",  // 60
    "Reumatología",  // 59
    "Nefrología",  // 58
    "Neurología",  // 56
    "Oncología Médica",  // 56
    "Fisioterapia",  // 53
    "Hematología",  // 51
    "Medicina Integrativa y Complementaria",  // 50
    "Urología",  // 48
    "Endocrinología, Diabetes y Metabolismo",  // 47
    "Cardiología",  // 39
    "Medicina de Urgencias y Cuidados Intensivos",  // 39
    "Rehabilitación y Medicina Física",  // 37
    "Infectología",  // 33
    "Medicina del Deporte",  // 32
    "Angiología",  // 30
    "Homeopatía",  // 30
    "Neurología Pediátrica",  // 29
    "Endoscopia",  // 28
    "Cirugía Maxilofacial",  // 27
    "Cirugía Vascular y Angiología",  // 25
    "Patología (Anatómica y Clínica)",  // 19
    "Proctología",  // 17
    "Inmunología",  // 16
    "Odontología Pediátrica",  // 16
    "Cardiología Pediátrica",  // 12
    "Cirugía Bariátrica",  // 12
    "Radiooncología",  // 12
    "Acupuntura",  // 11
    "Audiología",  // 11
    "Endocrinología Pediátrica",  // 11
    "Neumología Pediátrica",  // 11
    "Podología y Podiatría",  // 11
    "otoneurología y foniatría",  // 11
    "Medicina del Dolor y Algología",  // 10
    "Gastroenterología Pediátrica",  // 10
    "Sexología",  // 10
    "Salud Pública y Medicina Preventiva",  // 9
    "Naturopatía",  // 9
    "Cirugía Cardiotorácica",  // 8
    "Psicopedagogía",  // 8
    "Enfermería",  // 7
    "Reumatología Pediátrica",  // 7
    "Cirugía oncológica",  // 6
    "Retina Médica y Quirúrgica",  // 6
    "Ginecología Oncológica",  // 6
    "Hematología Pediátrica",  // 6
    "Nefrología Pediátrica",  // 6
    "Psiquiatría Infantil",  // 6
    "Quiropráctica",  // 6
    "Genética",  // 5
    "Optometría",  // 5
    "Dermatología Pediátrica",  // 4
    "Oncología Pediátrica",  // 4
    "Ortopedia Pediátrica",  // 4
    "Medicina del Enfermo Pediátrico en Estado Crítico",  // 3
    // "Logopedia",  // 3
    "Neurofisiología",  // 3
    "Oftalmología Pediátrica",  // 3
    // "Urólogo pediátrico",  // 3
    "Infectología Pediátrica",  // 2
    "Otorrinolaringología pediátrica",  // 2
    "Terapia ocupacional",  // 2
    "Ortodoncia",  // 1
    "Patología Bucal" // 1
    // "Urología pediátrica",  // 1

  ],
  ciudades: [
    "Ciudad de México",
    "Monterrey",
    "Guadalajara",
  ],
  padecimientos: [
    "Ansiedad",  // 599
    "Depresión",  // 561
    "Duelo",  // 535
    "Estrés",  // 446
    "Codependencia",  // 363
    "Estrés postraumático",  // 344
    "Trastorno de conducta",  // 305
    "Depresión en adolescentes",  // 302
    "Hipertensión",  // 300
    "Trastorno obsesivo compulsivo (TOC)",  // 298
    "Ataques de pánico",  // 288
    "Obesidad",  // 258
    "Diabetes",  // 256
    "Bullying (acoso escolar)",  // 251
    "Dislipidemia",  // 238
    "Caries",  // 234
    "Estrés laboral",  // 232
    "Dolor de muelas",  // 226
    "Trastorno de ansiedad",  // 225
    "Fracturas de dientes",  // 214
    "Síndrome metabólico",  // 212
    "Infección dental",  // 211
    "Bruxismo",  // 210
    "Trastorno de ansiedad generalizada",  // 208
    "Virus del papiloma humano (VPH)",  // 200
    "Embarazo",  // 199
    "Diabetes gestacional",  // 198
    "Miomas uterinos",  // 198
    "Trastornos de la personalidad",  // 197
    "Angustia",  // 194
    "Pérdida de dientes",  // 194
    "Desgaste dental",  // 190
    "Comportamiento suicida",  // 188
    "Menopausia",  // 186
    "Amenaza de aborto",  // 185
    "Sobrepeso",  // 180
    "Dientes desalineados",  // 179
    "Dientes apiñados",  // 169
    "Hernia de disco",  // 167
    "Lesiones deportivas",  // 166
    "Trastorno de hiperactividad y déficit de atención (TDAH)",  // 166
    "Enfermedad periodontal - piorrea",  // 162
    "Osteoporosis",  // 162
    "Síndrome de pinzamiento del hombro",  // 158
    "Insuficiencia cardíaca",  // 156
    "Conducta agresiva",  // 152
    "Embarazo de alto riesgo",  // 152
    "Endometriosis",  // 151
    "Lesiones de Menisco",  // 151
    "Depresión crónica",  // 149
    "Fobia específica o simple",  // 143
    "Sangrado uterino disfuncional",  // 143
    "Adicciones",  // 142
    "Maltrato psicológico y abandono infantil",  // 140
    "Desorden de ansiedad por separación",  // 138
    "Neumonía",  // 129
    "Desnutrición",  // 127
    "Lesión de Manguito Rotador",  // 126
    "Faringitis",  // 125
    "Depresión neurótica (distimia)",  // 123
    "Lesión de Ligamentarias de Rodilla",  // 121
    "Enfermedad articular degenerativa",  // 118
    "Infertilidad",  // 118
    "Apendicitis",  // 117
    "Gingivitis",  // 117
    "Lesiones de cartílago articular",  // 115
    "Ciática",  // 113
    "Dermatitis atópica",  // 113
    "Hernia inguinal",  // 112
    "Colon irritable",  // 111
    "Lumbalgia",  // 111
    "Cataratas",  // 109
    "Manchas en dientes",  // 107
    "Enfermedad de transmisión sexual (ETS)",  // 106
    "Mordida abierta",  // 103
    "Rinitis alérgica",  // 103
    "Osteoartrosis",  // 102
    "Asma",  // 101
    "Asma pediátrico",  // 101
    "Colecistitis aguda",  // 100
    "Diabetes tipo 2",  // 100
    "Diverticulitis",  // 100
    "Diente retenido",  // 99
    "Hernia umbilical",  // 99
    "Sensibilidad dentaria",  // 99
    "Baja autoestima",  // 98
    "Cardiomiopatía isquémica",  // 98
    "Anorexia nerviosa",  // 97
    "Fascitis plantar",  // 97
    "Depresión grave",  // 96
    "Hernia hiatal",  // 96
    "Luto",  // 96
    "Miopía",  // 96
    "Gastritis",  // 95
    "Abdomen agudo",  // 94
    "Atrición dental",  // 94
    "Absceso dental",  // 93
    "Bronquiolitis",  // 93
    "Periodontitis",  // 93
    "Reflujo gastroesofágico",  // 93
    "Quistes ováricos",  // 92
    "Anemia",  // 91
    "Trastornos de la articulación temporomandibular",  // 91
    "Cálculos biliares",  // 89
    "Sobremordida",  // 89
    "Acné",  // 88
    "Desgaste de rodilla",  // 88
    "Hernia",  // 87
    "Movilidad dentaria",  // 87
    "Tendinitis",  // 86
    "Cáncer de piel",  // 85
    "Oclusión dental defectuosa",  // 85
    "Radiculopatía lumbar",  // 85
    "Bulimia nerviosa",  // 84
    "Diente impactado",  // 84
    "Cáncer del colon",  // 82
    "Cáncer de próstata",  // 81
    "Alveolitis",  // 80
    "Glaucoma",  // 80
    "Infarto agudo de miocardio",  // 80
    "Desgaste de cadera",  // 79
    "Dolor muscular",  // 79
    "Trastornos del aprendizaje",  // 79
    "Cólico infantil",  // 78
    "Tendinitis del manguito de los rotadores",  // 78
    "Diarrea",  // 77
    "Embarazo ectópico",  // 77
    "Pie plano",  // 77
    "Reflujo gastroesofágico en bebés",  // 77
    "Trastorno bipolar",  // 77
    "Artrosis",  // 76
    "Esquizofrenia",  // 76
    "Hemorroides",  // 76
    "Ovarios poliquísticos",  // 76
    "Retinopatía diabética",  // 76
    "Demencia",  // 75
    "Eyaculación precoz",  // 75
    "Sangrado uterino anormal",  // 75
    "Alergia alimentaria",  // 73
    "Astigmatismo",  // 73
    "Cambios precancerosos del cuello uterino",  // 73
    "Contractura cervical",  // 73
    "Halitosis",  // 73
    "Hipermetropía",  // 73
    "Impactación dental",  // 73
    "Colecistitis crónica",  // 72
    "Fobia social",  // 72
    "Síndrome de los ovarios poliquísticos (PCOS)",  // 72
    "Angina",  // 71
    "Hombro congelado",  // 71
    "Infección urinaria en niños",  // 71
    "Pterigión",  // 71
    "EIP (infección genital femenina)",  // 70
    "Fiebre en niños",  // 70
    "Amigdalitis",  // 69
    "Arritmias",  // 69
    "Conjuntivitis",  // 69
    "Dermatitis del pañal",  // 69
    "Disfunción eréctil",  // 68
    "Infarto de miocardio",  // 68
    "Pie Diabético",  // 68
    "Síndrome de burnout",  // 68
    "Trastornos de la ATM",  // 68
    "Alopecia areata",  // 67
    "Hipertensión inducida por el embarazo",  // 67
    "Cáncer del cuello uterino",  // 66
    "Embarazo en la adolescencia",  // 66
    "Melasma",  // 66
    "Síndrome del ojo seco",  // 66
    "Depresión posparto",  // 65
    "Enfermedad de Alzheimer",  // 65
    "Fracturas de cadera",  // 65
    "Osteoartritis",  // 65
    "Trastornos del sueño",  // 65
    "Bradicardia",  // 64
    "Colitis",  // 64
    "Gastritis por estrés",  // 64
    "Hipertiroidismo",  // 64
    "Trastornos de la menstruación",  // 64
    "Alopecia androgénica",  // 63
    "Psoriasis",  // 63
    "Sinusitis",  // 63
    "Varicocele",  // 63
    "Verrugas",  // 63
    "Cáncer de pulmón",  // 61
    "Enfermedad inflamatoria pélvica (EIP)",  // 61
    "Fisura anal",  // 61
    "Preeclampsia",  // 61
    "Prognatismo",  // 61
    "Trastorno de la conducta alimentaria",  // 61
    "Disoclusión de los dientes",  // 60
    "Fracturas",  // 60
    "Incontinencia urinaria de esfuerzo",  // 60
    "Juanetes",  // 60
    "Verrugas genitales",  // 60
    "Vitiligo",  // 59
    "Bebé prematuro",  // 58
    "Bronquitis crónica",  // 58
    "Displasia cervical",  // 58
    "Enfermedad benigna de las mamas",  // 58
    "Esguince",  // 58
    "Condiloma acuminado",  // 57
    "Depresión mayor",  // 57
    "Enfermedad de Parkinson",  // 56
    "Nutrición inadecuada",  // 56
    "Úlceras bucales",  // 56
    "Conjuntivitis alérgica",  // 55
    "Cáncer de tiroides",  // 55
    "Enfermedad de la vesícula biliar",  // 55
    "Hipercolesterolemia",  // 55
    "Urticaria",  // 55
    "Ausencia dentaria",  // 54
    "Bursitis",  // 54
    "Cáncer renal",  // 54
    "Depresión en los ancianos",  // 54
    "Hígado graso",  // 54
    "Cálculos en las vías urinarias",  // 53
    "Cáncer de mama",  // 53
    "Estreñimiento",  // 53
    "Fibrilación auricular",  // 53
    "Migraña",  // 53
    "Enfermedad de los ovarios poliquísticos",  // 52
    "Neurosis histérica",  // 52
    "Cardiopatía hipertensiva",  // 51
    "Codo de tenista",  // 51
    "Desprendimiento de retina",  // 51
    "Otitis",  // 51
    "Síntomas gastrointestinales",  // 51
    "Trastorno de adaptación",  // 51
    "Trastorno depresivo grave",  // 51
    "Absceso anal",  // 50
    "Abuso sexual",  // 50
    "Apnea del sueño de tipo obstructivo",  // 50
    "Epilepsia",  // 50
    "Hiperlipidemia",  // 50
    "Cicatriz queloide",  // 49
    "Dolor de espalda inespecífico",  // 49
    "Esterilidad",  // 49
    "Bocio",  // 48
    "Dolor abdominal",  // 48
    "Dolor en la inserción del talón",  // 48
    "Gastroenteritis",  // 48
    "Obesidad mórbida",  // 48
    "Alergias",  // 47
    "Alergias nasales",  // 47
    "Cefalea tensional",  // 47
    "Hipertrofia (hiperplasia) prostática benigna",  // 47
    "Alergia a las proteínas de la leche (niño pequeño)",  // 46
    "Autismo",  // 46
    "Cirrosis",  // 46
    "Contracturas musculares",  // 46
    "Control de emociones",  // 46
    "Cáncer testicular",  // 45
    "Deshidratación",  // 45
    "Escoliosis",  // 45
    "Gastroenteritis aguda",  // 45
    "Luxación Acromioclavicular",  // 45
    "Manchas de la edad",  // 45
    "Nefropatía diabética",  // 45
    "Pólipos nasales",  // 45
    "Síndrome del túnel carpiano",  // 45
    "Coledocolitiasis",  // 44
    "Lunar",  // 44
    "Miedos y fobias",  // 44
    "Disco roto",  // 43
    "Hipotiroidismo",  // 43
    "Prolapso uterino",  // 43
    "Tabaquismo",  // 43
    "Trastorno del sueño por ansiedad",  // 43
    "Dependencia emocional",  // 42
    "Dermatitis seborreica",  // 42
    "Inestabilidad Glenohumeral",  // 42
    "Trastornos cardiovasculares",  // 42
    "Cáncer vesical",  // 41
    "Dermatitis alérgica",  // 41
    "Fracturas por compresión o aplastamiento vertebral",  // 41
    "Vértigo postural benigno",  // 41
    "Anorexia",  // 40
    "Cicatriz hipertrófica",  // 40
    "Curvatura de la columna",  // 40
    "Cálculos renales",  // 40
    "Enfermedad fibroquística de las mamas",  // 40
    "Fractura de antebrazo",  // 40
    "Blefaritis",  // 39
    "Cistitis",  // 39
    "Derrame pleural",  // 39
    "Laringitis",  // 39
    "Pancreatitis",  // 39
    "Autolesiones",  // 38
    "Condromalacia rotuliana",  // 38
    "Cáncer de los ovarios",  // 38
    "Cáncer del estómago",  // 38
    "Dedos en garra",  // 38
    "Insomnio crónico",  // 38
    "Trastorno límite de la personalidad",  // 38
    "Tristeza",  // 38
    "Bronconeumonía",  // 37
    "Colelitiasis",  // 37
    "Degeneración macular relacionada con la edad (AMD)",  // 37
    "Fatiga crónica",  // 37
    "Fibromialgia",  // 37
    "Infección aguda de las vías urinarias (IVU aguda)",  // 37
    "Lesiones ligamentarias de rodillas",  // 37
    "Muelas del juicio",  // 37
    "Amelogénesis imperfecta",  // 36
    "Apnea del sueño",  // 36
    "Candidiasis vaginal",  // 36
    "Fractura coronal",  // 36
    "Fractura de fémur",  // 36
    "Hepatitis",  // 36
    "Presión arterial alta (Hipertensión)",  // 36
    "Trastorno bipolar afectivo",  // 36
    "Trastornos del sueño en personas mayores",  // 36
    "Diabetes tipo 1",  // 35
    "Distimia",  // 35
    "Dolor de rodilla",  // 35
    "EPOC",  // 35
    "Rosácea",  // 35
    "Tenosinovitis",  // 35
    "Trastorno del espectro autista (TEA)",  // 35
    "Anomalía dentaria",  // 34
    "Ojo rojo",  // 34
    "Orzuelo",  // 34
    "Relaciones insanas",  // 34
    "Síndrome de Sjogren",  // 34
    "Taquicardia",  // 34
    "Trauma",  // 34
    "Artritis",  // 33
    "Coronavirus COVID-19",  // 33
    "Dermatitis por contacto",  // 33
    "Dolor post endodoncia",  // 33
    "Erosión Dental",  // 33
    "Esofagitis por reflujo",  // 33
    "Espondilitis anquilosante",  // 33
    "Gastroenteritis bacteriana con diarrea infecciosa",  // 33
    "Hidrocele",  // 33
    "Miedo",  // 33
    "Resistencia a la insulina",  // 33
    "Síndrome de caídas",  // 33
    "Absceso de Bartolino",  // 32
    "Apatía sexual",  // 32
    "Estenosis aórtica",  // 32
    "Fimosis",  // 32
    "Glomerulonefritis",  // 32
    "Hipocondría",  // 32
    "Inseguridad",  // 32
    "Intolerancia a la lactosa",  // 32
    "Onicomicosis",  // 32
    "Ronquido",  // 32
    "Traumatismo dental",  // 32
    "Aborto incompleto",  // 31
    "Aflicción",  // 31
    "Asma bronquial",  // 31
    "Deseo sexual inhibido",  // 31
    "Dislexia",  // 31
    "Dolor de columna",  // 31
    "Enfermedades de la tiroides",  // 31
    "Melanoma",  // 31
    "Nódulo tiroideo",  // 31
    "Avulsión dental",  // 30
    "Bulímia",  // 30
    "Cicatrices de acné",  // 30
    "Crisis respiratoria en recién nacidos",  // 30
    "Fistula dental o en encía",  // 30
    "Fractura de la pelvis",  // 30
    "Hemorragia cerebral",  // 30
    "Hombro de lanzador",  // 30
    "Hombro de tenista",  // 30
    "Lesiones ligamentarias en mano y muñeca",  // 30
    "Parálisis facial",  // 30
    "Sonrisa gingival",  // 30
    "Trastorno de personalidad narcisista",  // 30
    "Tuberculosis pulmonar",  // 30
    "Tumor cerebral en niños",  // 30
    "Adenoma de tiroides",  // 29
    "Aneurisma cerebral",  // 29
    "Artritis reumatoide",  // 29
    "Capsulitis adhesiva",  // 29
    "Cardiomiopatía dilatada",  // 29
    "Conducta",  // 29
    "Criptorquidia",  // 29
    "Dependencia del alcohol",  // 29
    "Dolor de cadera",  // 29
    "Fibrosis pulmonar",  // 29
    "Gigantomastia",  // 29
    "Ictericia del recién nacido",  // 29
    "Insuficiencia renal aguda",  // 29
    "Ludopatía",  // 29
    "Lupus",  // 29
    "Síndrome del colon irritable (IBS)",  // 29
    "Síndrome nefrótico",  // 29
    "Vacío",  // 29
    "Agujero macular",  // 28
    "Cardiopatía congénita",  // 28
    "Dolor de cabeza por contracción muscular",  // 28
    "Hidrocefalia",  // 28
    "Obstrucción intestinal",  // 28
    "Presbicia",  // 28
    "Síndrome de dificultad respiratoria en neonatos",  // 28
    "Tumor cerebral en adultos",  // 28
    "Adenoides agrandadas",  // 27
    "Amenorrea primaria",  // 27
    "Cardiopatías",  // 27
    "Cáncer colorrectal",  // 27
    "Dedo del pie en martillo",  // 27
    "Derrame cerebral",  // 27
    "Edema macular",  // 27
    "Fibroadenoma de mama",  // 27
    "Fluorosis",  // 27
    "Hipertensión pulmonar",  // 27
    "Linfoma de Hodgkin",  // 27
    "Queratocono",  // 27
    "Trastorno de alimentación en la lactancia y en la primera infancia",  // 27
    "Acalasia",  // 26
    "Artritis psoriásica",  // 26
    "Cáncer de piel en célula basal",  // 26
    "Cáncer de testículos",  // 26
    "Delgadez",  // 26
    "Demencia vascular",  // 26
    "Desregulación disruptiva del estado de ánimo",  // 26
    "Epicondilitis humeral",  // 26
    "Faringitis bacteriana",  // 26
    "Fractura de mano",  // 26
    "Hombro de nadador",  // 26
    "Infección urinaria en adultos",  // 26
    "Molusco contagioso",  // 26
    "Niveles elevados de colesterol y triglicéridos",  // 26
    "Quiste pilonidal",  // 26
    "Radiculopatía cervical",  // 26
    "Síncope",  // 26
    "Trastorno por atracón",  // 26
    "Varicela",  // 26
    "Accidente cerebrovascular isquémico",  // 25
    "Cervicitis",  // 25
    "Dolor de cabeza",  // 25
    "Drogadicción",  // 25
    "Enfermedad cerebrovascular",  // 25
    "Estrabismo",  // 25
    "Irratibilidad",  // 25
    "Lesión facial",  // 25
    "Psicosis",  // 25
    "Resfriado común",  // 25
    "Trastornos en la alimentación del anciano",  // 25
    "Trombosis venosa profunda",  // 25
    "Verrugas del pene",  // 25
    "Violencia de género",  // 25
    "Alopecia en hombres",  // 24
    "Anemia ferropénica en niños",  // 24
    "Ausencia de la menstruación",  // 24
    "Convulsiones febriles",  // 24
    "Dermatomiositis",  // 24
    "Enuresis",  // 24
    "Herpes genital",  // 24
    "Infección del oído",  // 24
    "Insomnio psicofisiológico (aprendido)",  // 24
    "Lesiones del tendón rotuliano",  // 24
    "Reflujo vesicoureteral",  // 24
    "Trastorno de identidad de género",  // 24
    "Trastornos hormonales",  // 24
    "Trauma ocular",  // 24
    "Úlceras e infecciones corneales",  // 24
    "Abuso sexual infantil",  // 23
    "Angina crónica",  // 23
    "Angina inestable",  // 23
    "Celulitis",  // 23
    "Compresión de la médula espinal",  // 23
    "Eliminación de amalgamas",  // 23
    "Embarazo múltiple",  // 23
    "Enfermedades gastrointestinales",  // 23
    "Enfermedades y dolor crónico",  // 23
    "Falla renal crónica",  // 23
    "Herpes zóster (culebrilla)",  // 23
    "Hipoacusia relacionada con la edad",  // 23
    "Hipotiroidismo en adultos",  // 23
    "Hombro rígido",  // 23
    "Linfoma no Hodgkin",  // 23
    "Miocardiopatías",  // 23
    "Neuropatía del nervio ciático",  // 23
    "Pericarditis",  // 23
    "Pielonefritis",  // 23
    "Pinzamiento Subacromial",  // 23
    "Rodilla vara",  // 23
    "Trastorno de la personalidad pasivo-agresiva",  // 23
    "Trastornos asociados con el vértigo",  // 23
    "Úlcera gastroduodenal aguda",  // 23
    "Aborto espontáneo",  // 22
    "Acné vulgar",  // 22
    "Anemia por deficiencia de hierro en los niños",  // 22
    "Ateroesclerosis",  // 22
    "Dolor de hombro",  // 22
    "Embarazo de bajo riesgo",  // 22
    "Espondilolistesis",  // 22
    "Estenosis de la válvula aórtica",  // 22
    "Estreñimiento en niños",  // 22
    "Falla cardíaca",  // 22
    "Insuficiencia crónica del riñón",  // 22
    "Insuficiencia venosa",  // 22
    "Litiasis renal",  // 22
    "Masas cutáneas de grasa",  // 22
    "Pancreatitis aguda",  // 22
    "Parto prematuro",  // 22
    "Quemaduras",  // 22
    "TEPT",  // 22
    "Trastorno de oposición desafiante",  // 22
    "Trastornos de la voz",  // 22
    "Úlceras venosas",  // 22
    "Alergias a fármacos",  // 21
    "Ambliopía",  // 21
    "Arrancamiento compulsivo del cabello",  // 21
    "Cistitis aguda",  // 21
    "Codo de niñera",  // 21
    "Comportamiento psicótico",  // 21
    "Depresión en el embarazo",  // 21
    "Dislalia",  // 21
    "Eclampsia",  // 21
    "Encías expuestas",  // 21
    "Esclerodermia",  // 21
    "Esofagitis",  // 21
    "Fractura de la base del metatarso",  // 21
    "Gingivitis ulceronecrosante aguda",  // 21
    "Infección aguda del oído",  // 21
    "Infección crónica de los senos paranasales",  // 21
    "Infección urinaria recurrente",  // 21
    "Leucemia",  // 21
    "Nefrolitiasis",  // 21
    "Uveítis",  // 21
    "Agrandamiento de la próstata",  // 20
    "Colesterol",  // 20
    "Cálculos en el tracto urinario",  // 20
    "Dolor en la espalda",  // 20
    "Esclerosis múltiple",  // 20
    "Espondiloartropatía",  // 20
    "Gota aguda",  // 20
    "Hemofilia",  // 20
    "Hiperhidrosis",  // 20
    "Insuficiencia arterial",  // 20
    "Linfedema",  // 20
    "Nefritis lúpica",  // 20
    "Nevos",  // 20
    "Obstrucción del conducto lagrimal",  // 20
    "Onicocriptosis",  // 20
    "Parálisis del nervio facial",  // 20
    "Pie equino varo",  // 20
    "Piedras en el riñón",  // 20
    "Púrpura trombocitopénica idiopática (ITP)",  // 20
    "Quiste epidermoide",  // 20
    "Quiste sebáceo",  // 20
    "Síndrome antifosfolípido",  // 20
    "Síndrome de apnea obstructiva del sueño",  // 20
    "Síndrome de dolor pélvico crónico",  // 20
    "Trastorno de personalidad histriónica",  // 20
    "Traumatismo facial",  // 20
    "Tumor cerebral canceroso (metastásico)",  // 20
    "Acné rosácea",  // 19
    "Adherencias",  // 19
    "Amenorrea secundaria",  // 19
    "Angina estable",  // 19
    "Aversión al sexo",  // 19
    "Cardiopatía coronaria",  // 19
    "Craneosinostosis",  // 19
    "Defensas bajas",  // 19
    "Deformidad en valgo del dedo gordo",  // 19
    "Degeneración macular",  // 19
    "Dentición",  // 19
    "Displasia congénita de la cadera",  // 19
    "Enfermedad de Meniere",  // 19
    "Envejecimiento cutáneo",  // 19
    "Estenosis mitral",  // 19
    "Gangrena de tejidos blandos",  // 19
    "Hiperplasia prostática",  // 19
    "Infertilidad masculina",  // 19
    "Lesión corneal",  // 19
    "Trastorno del control de los impulsos",  // 19
    "Vulvovaginitis",  // 19
    "Accidente cerebrovascular hemorrágico",  // 18
    "Alta miopía",  // 18
    "Ascitis",  // 18
    "Coagulopatía",  // 18
    "Crup",  // 18
    "Cáncer de cabeza y cuello",  // 18
    "Divertículo de Meckel",  // 18
    "Enfermedad coronaria (CHD)",  // 18
    "Enfermedad inflamatoria intestinal",  // 18
    "Enfermedad renal",  // 18
    "Mucocele",  // 18
    "Peritonitis",  // 18
    "Pesadillas constantes",  // 18
    "Pulpitis",  // 18
    "Rechazo al trasplante",  // 18
    "Síndrome de dolor miofascial",  // 18
    "Tapón de cerumen",  // 18
    "Trastorno Déficit de atención e hiperactividad",  // 18
    "Trastorno del desarrollo de la lectura",  // 18
    "Trastornos del desarrollo sexual",  // 18
    "Trombocitopenia",  // 18
    "Tumor tiroideo",  // 18
    "Tumores o protuberancias en las mamas",  // 18
    "Absceso mamario",  // 17
    "Abuso del alcohol",  // 17
    "Adherencia intraperitoneal",  // 17
    "Agrandamiento de adenoides",  // 17
    "Anemia hemolítica",  // 17
    "Ataque cardíaco",  // 17
    "Cerumen (cera del oído)",  // 17
    "Chalazión",  // 17
    "Contractura de Dupuytren",  // 17
    "Cuello torcido",  // 17
    "Cálculo en el conducto biliar",  // 17
    "Cáncer de vejiga",  // 17
    "Delirium",  // 17
    "Dengue",  // 17
    "Deseo sexual hipoactivo",  // 17
    "Discapacidad intelectual",  // 17
    "Embarazo molar",  // 17
    "Enfermedad cardíaca isquémica",  // 17
    "Enfermedad celíaca (esprúe)",  // 17
    "Epicondilitis lateral",  // 17
    "Espondilitis",  // 17
    "Exceso de flujo vaginal - leucorrea",  // 17
    "Gastritis crónica",  // 17
    "Hidronefrosis",  // 17
    "Influenza",  // 17
    "Insuficiencia renal",  // 17
    "Membrana epirretiniana macular",  // 17
    "Mieloma múltiple",  // 17
    "Parálisis cerebral",  // 17
    "Pseudoartrosis",  // 17
    "Párpados caídos",  // 17
    "Restricción del crecimiento intrauterino",  // 17
    "Ronchas o habones",  // 17
    "Temblor inducido por fármacos",  // 17
    "Trastornos de la marcha",  // 17
    "Trastornos de las glándulas salivales",  // 17
    "Venas varicosas",  // 17
    "Alcoholismo",  // 16
    "Alergia al moho, la caspa y el polvo",  // 16
    "Balanitis",  // 16
    "Cambios en la piel inducidos por el sol",  // 16
    "Colangitis",  // 16
    "Cáncer de endometrio",  // 16
    "Demencia con los cuerpos de Lewy",  // 16
    "Encefalopatía hepática",  // 16
    "Enfermedad de von Willebrand",  // 16
    "Enfermedad ovárica poliquística",  // 16
    "Estenosis pilórica",  // 16
    "Falta de fluidez en el lenguaje",  // 16
    "Hemorragia subconjuntival",  // 16
    "Hipercolesterolemia familiar",  // 16
    "Hiperparatiroidismo",  // 16
    "Inclusión dentaria",  // 16
    "Infecciones frecuentes de garganta",  // 16
    "Infección de las vías urinarias (IVU) en adultos",  // 16
    "Intolerancia al gluten",  // 16
    "Labio leporino y paladar hendido",  // 16
    "Neuroma de Morton",  // 16
    "Oclusión de las venas retinianas",  // 16
    "Pólipos cervicales",  // 16
    "Síndrome del intestino irritable",  // 16
    "Síndrome premenstrual (SPM)",  // 16
    "Tendinitis, esguinces articulares",  // 16
    "Terror nocturno",  // 16
    "Tumor de la médula espinal",  // 16
    "Verrugas plantares",  // 16
    "Aborto inevitable",  // 15
    "Adenomioma",  // 15
    "Adenomiosis",  // 15
    "Alergias a las mascotas",  // 15
    "Amenaza de aborto espontáneo",  // 15
    "Anemia aplásica adquirida",  // 15
    "Anemia ferropénica",  // 15
    "Caspa",  // 15
    "Cefalea en racimo",  // 15
    "Cifoescoliosis",  // 15
    "Colitis ulcerosa",  // 15
    "Coágulo en las piernas",  // 15
    "Cáncer de pene",  // 15
    "Cáncer del páncreas",  // 15
    "Defectos de refracción",  // 15
    "Desgastes de articulaciones",  // 15
    "Displasia del desarrollo de la cadera",  // 15
    "Dolor de huesos y articulaciones",  // 15
    "Ectropión",  // 15
    "Embarazo abdominal",  // 15
    "Endocarditis",  // 15
    "Flebitis",  // 15
    "Fístula gastrointestinal",  // 15
    "Gingivoestomatitis",  // 15
    "Infección recurrente de las vías urinarias",  // 15
    "Meningitis",  // 15
    "Queratosis: tumores benignos de la piel",  // 15
    "Tendinitis bicipital",  // 15
    "Úlcera gástrica",  // 15
    "Absceso hepático bacteriano",  // 14
    "Absceso intraabdominal",  // 14
    "Absceso periamigdalino",  // 14
    "Acidez",  // 14
    "Aneurisma aórtico abdominal",  // 14
    "Artritis gotosa aguda",  // 14
    "Curvatura del pene",  // 14
    "Dermatitis y úlceras por estasis",  // 14
    "Displasia del desarrollo de la articulación de la cadera",  // 14
    "Dolor de mano",  // 14
    "Eccema",  // 14
    "Embarazo anembrionario (Huevo huero)",  // 14
    "Enfermedad de Crohn",  // 14
    "Enfermedad de Osgood-Schlatter",  // 14
    "Enfermedad de Quervain",  // 14
    "Estenosis uretral",  // 14
    "Hemorroides trombosadas",  // 14
    "Hernia crural",  // 14
    "Hipospadias",  // 14
    "Infarto cerebral",  // 14
    "Infecciones de vías respiratorias de repetición (o recurrentes)",  // 14
    "Infección del riñón",  // 14
    "Insuficiencia aguda del riñón",  // 14
    "Insuficiencia venosa crónica",  // 14
    "Luxación parcial del codo",  // 14
    "Mioma",  // 14
    "Perimenopausia",  // 14
    "Prolapso de disco intervertebral",  // 14
    "Reacción anafiláctica",  // 14
    "Shock anafiláctico",  // 14
    "Subluxación del codo",  // 14
    "Síndrome compartimental",  // 14
    "Tendinitis del talón",  // 14
    "Trastorno de pánico con agorafobia",  // 14
    "Trastornos por inmunodeficiencia",  // 14
    "Trauma dental",  // 14
    "Úlcera péptica",  // 14
    "Accidente cerebrovascular",  // 13
    "Acumulación de placa en las arterias",  // 13
    "Alergias en ambientes interiores",  // 13
    "Artritis por gota crónica",  // 13
    "Cataratas congénitas",  // 13
    "Cetoacidosis diabética",  // 13
    "Cáncer de vagina",  // 13
    "Cáncer endometrial",  // 13
    "Cáncer laríngeo",  // 13
    "Deseo sexual hiperactivo",  // 13
    "Diarrea bacteriana",  // 13
    "Diverticulosis",  // 13
    "Dolor asociado con la ovulación",  // 13
    "Dolor en mitad del ciclo menstrual",  // 13
    "Dolor oncológico",  // 13
    "Enfermedad de Cushing",  // 13
    "Enfermedad renal terminal",  // 13
    "Esclerosis sistémica",  // 13
    "Espondilosis cervical",  // 13
    "Estenosis raquídea",  // 13
    "Gangrena",  // 13
    "Gonorrea",  // 13
    "Hematoma epidural",  // 13
    "Heridas",  // 13
    "Hernia diafragmática",  // 13
    "Hidrocele de la túnica vaginal del testículo (proceso vaginal)",  // 13
    "Hiperplasia endometrial benigna",  // 13
    "Infección aguda de la vejiga",  // 13
    "Infección complicada de las vías urinarias",  // 13
    "Inflamación de pies",  // 13
    "Insuficiencia mitral",  // 13
    "Intolerancia a la glucosa durante el embarazo",  // 13
    "Laberíntitis",  // 13
    "Lipoma cervical",  // 13
    "Nariz bulbosa",  // 13
    "Neurodivergencia",  // 13
    "Neutropenia",  // 13
    "Peritonitis asociada con diálisis",  // 13
    "Pie cavo",  // 13
    "Queratoglobo",  // 13
    "Quiste de Baker",  // 13
    "Raíces expuestas",  // 13
    "Ronchas",  // 13
    "Submordida",  // 13
    "Síndrome femororrotuliano",  // 13
    "Tics transitorios",  // 13
    "Tiña",  // 13
    "Tos crónica",  // 13
    "Trastorno de la personalidad evasiva",  // 13
    "Tuberculosis",  // 13
    "Vaginitis",  // 13
    "Verrugas venéreas",  // 13
    "Absceso cerebral",  // 12
    "Alergia de insectos",  // 12
    "Almorranas",  // 12
    "Aneurisma",  // 12
    "Artritis bacteriana",  // 12
    "Asimetría facial",  // 12
    "Asma inducido por el ejercicio",  // 12
    "Cetoacidosis",  // 12
    "Clamidia",  // 12
    "Codo dislocado en niños",  // 12
    "Coroidopatía serosa central",  // 12
    "Cáncer",  // 12
    "Deficiencia de la hormona del crecimiento",  // 12
    "Delirio",  // 12
    "Desplazamiento de la cabeza del fémur",  // 12
    "Dolor de dedos",  // 12
    "El tartamudeo y los niños",  // 12
    "Encorvadura de la espalda",  // 12
    "Enfermedad de Legg-Calve-Perthes",  // 12
    "Enfermedad vascular periférica",  // 12
    "Esclerosis lateral amiotrófica",  // 12
    "Esguinces",  // 12
    "Hepatitis C",  // 12
    "Infecciones",  // 12
    "Infecciones de vías urinarias",  // 12
    "Infecciones por clamidia en mujeres",  // 12
    "Infección crónica del oído",  // 12
    "Luxaciones",  // 12
    "Miastenia grave",  // 12
    "Periimplantitis",  // 12
    "Próstata agrandada",  // 12
    "Pérdida del cabello en mujeres",  // 12
    "Sangrado anovulatorio",  // 12
    "Sialoadenitis",  // 12
    "Sinusitis crónica",  // 12
    "Síndrome de Guillain-Barré",  // 12
    "Síndrome del intestino corto",  // 12
    "Tetralogía de Fallot",  // 12
    "Tumor del riñón o Tumor renal",  // 12
    "Tumor nasal",  // 12
    "Abuso de drogas y farmacodependencia",  // 11
    "Acrocordones",  // 11
    "Acromegalia",  // 11
    "Adenoma hipofisario secretor de prolactina",  // 11
    "Adherencia intrauterina",  // 11
    "Atresia esofágica",  // 11
    "Autismo en mujeres",  // 11
    "Bocio multinodular tóxico",  // 11
    "Bursitis epitroclear",  // 11
    "Callos y callosidades",  // 11
    "Calvicie de patrón femenino",  // 11
    "Carcinoma hepatocelular",  // 11
    "Comunicación interauricular",  // 11
    "Conducto arterial persistente",  // 11
    "Conducto nasolagrimal obstruido",  // 11
    "Cáncer tiroideo (carcinoma medular)",  // 11
    "Daño renal",  // 11
    "Desprendimiento prematuro de placenta",  // 11
    "Disfunción de la trompa de Eustaquio",  // 11
    "Dolor somático",  // 11
    "Embarazo tubárico",  // 11
    "Encopresis",  // 11
    "Enfermedades renales",  // 11
    "Eritema tóxico del neonato",  // 11
    "Espasticidad",  // 11
    "Fiebre de origen desconocido",  // 11
    "Glándula de Bartolino",  // 11
    "Hemangioma",  // 11
    "Hiperplasia suprarrenal congénita",  // 11
    "Hipoacusia en bebés",  // 11
    "Hombro doloroso",  // 11
    "Infección vaginal por levaduras",  // 11
    "Infección vaginal por tricomonas",  // 11
    "Infección viral de las vías respiratorias bajas",  // 11
    "Luxación de la cabeza del radio",  // 11
    "Mastitis",  // 11
    "Neuropatias Compresivas",  // 11
    "Neuropatía del nervio radial",  // 11
    "Neuropatía diabética",  // 11
    "Náuseas persistentes en el embarazo",  // 11
    "Osteonecrosis",  // 11
    "Osteosarcoma",  // 11
    "Parafimosis",  // 11
    "Perforación gastrointestinal",  // 11
    "Personalidad psicopática",  // 11
    "Postura jorobada",  // 11
    "Prolapso rectal",  // 11
    "Pérdida gestacional recurrente",  // 11
    "Queratoconjuntivitis seca",  // 11
    "Quistes ováricos fisiológicos",  // 11
    "Quistes ováricos funcionales",  // 11
    "Reducción de grasa (adiposidades)",  // 11
    "Retinopatía de la prematuridad",  // 11
    "Retraso del desarrollo",  // 11
    "Sinusitis aguda",  // 11
    "TAG",  // 11
    "Tartamudeo",  // 11
    "Tinnitus",  // 11
    "Trastorno convulsivo",  // 11
    "Trastorno de dolor",  // 11
    "Tumor hipofisario",  // 11
    "Uremia",  // 11
    "Úlcera duodenal",  // 11
    "ADHD",  // 10
    "Absceso de las amígdalas",  // 10
    "Acalasia esofágica",  // 10
    "Ano imperforado",  // 10
    "Artritis idiopática juvenil",  // 10
    "Astrocitoma en niños",  // 10
    "Atrofia muscular espinal",  // 10
    "Bacteriuria asintomática",  // 10
    "Bursitis retrocalcánea",  // 10
    "Calvicie de patrón masculino",  // 10
    "Cifosis",  // 10
    "Colestasis intrahepática",  // 10
    "Colon redundante",  // 10
    "Complicaciones en cirugía laparoscópica",  // 10
    "Cáncer de células transicionales de la pelvis renal o del uréter",  // 10
    "Cáncer de piel escamocelular",  // 10
    "Cáncer del hígado",  // 10
    "Cáncer: leucemia infantil aguda (LLA)",  // 10
    "Demencia senil",  // 10
    "Depresión psicótica",  // 10
    "Derrame subdural",  // 10
    "Desviación Septal",  // 10
    "Dislocación en el desarrollo de la cadera",  // 10
    "Enfermedad de Hirschsprung",  // 10
    "Enfermedad mano-pie-boca",  // 10
    "Enfermedad trofoblástica gestacional",  // 10
    "Enfermedades psicosomáticas de la piel",  // 10
    "Estenosis biliar",  // 10
    "Eyaculación retrasada",  // 10
    "Fisura vaginal",  // 10
    "Herpes labial",  // 10
    "Hipertensión arterial sistémica",  // 10
    "Infección del tejido mamario",  // 10
    "Infección necrosante de tejidos blandos",  // 10
    "Insuficiencia respiratoria",  // 10
    "Isquemia testicular",  // 10
    "Leucemia aguda de la infancia",  // 10
    "Malabsorción",  // 10
    "Malformación anorrectal",  // 10
    "Meningioma en adultos",  // 10
    "Miositis",  // 10
    "Mutismo selectivo",  // 10
    "Neumonía nosocomial o intrahospitalaria",  // 10
    "Nutrición y salud emocional",  // 10
    "Oclusión de la vena retiniana central",  // 10
    "Opacidad del cristalino",  // 10
    "Ovario poliquístico",  // 10
    "Ovulación dolorosa",  // 10
    "Prostatitis aguda",  // 10
    "Pólipos colorrectales",  // 10
    "Púrpura trombocitopénica inmunitaria",  // 10
    "Queratitis por herpes simple",  // 10
    "Quiste mucoso",  // 10
    "Quistes vaginales",  // 10
    "Síndrome de Asperger",  // 10
    "Síndrome de bradicardia-taquicardia",  // 10
    "Síndrome de oclusión de la arteria carótida",  // 10
    "Síndrome de resistencia a la insulina",  // 10
    "Taquicardia supraventricular paroxística (TSVP)",  // 10
    "Tendinitis calcificada",  // 10
    "Tiroides",  // 10
    "Trastorno de terror durante el sueño",  // 10
    "Trastorno esquizoafectivo",  // 10
    "Tromboflebitis",  // 10
    "Vejiga hiperreactiva",  // 10
    "Abuso de drogas",  // 9
    "Adenocarcinoma del útero",  // 9
    "Anomalías congénitas",  // 9
    "Arcos caídos",  // 9
    "Atresia duodenal",  // 9
    "Bronquiectasia",  // 9
    "Brucelosis",  // 9
    "Carcinoma corticosuprarrenal",  // 9
    "Carcinoma de células renales",  // 9
    "Carcinoma papilar de la tiroides",  // 9
    "Cardiomiopatía hipertrófica (CMH)",  // 9
    "Celiaquía",  // 9
    "Celulitis orbitaria",  // 9
    "Comunicación interventricular",  // 9
    "Cáncer de esófago",  // 9
    "Dengue hemorrágico",  // 9
    "Diarrea crónica",  // 9
    "Disfagia",  // 9
    "Dislocación de la cabeza radial",  // 9
    "Displasia broncopulmonar",  // 9
    "Distrofia de Fuchs",  // 9
    "Divertículos del colon",  // 9
    "Embolia arterial",  // 9
    "Embolia cerebral",  // 9
    "Enfermedad de Peyronie",  // 9
    "Enfermedades de la glándula mamaria",  // 9
    "Enfermedades terminales",  // 9
    "Esguince cervical",  // 9
    "Esplenectomía - síndrome posoperatorio",  // 9
    "Espolón calcáneo y fascitis plantar",  // 9
    "Estenosis de la válvula pulmonar",  // 9
    "Fiebre tifoidea",  // 9
    "Gastrosquisis",  // 9
    "Hematoma subdural crónico",  // 9
    "Hemiplejía",  // 9
    "Hepatitis B",  // 9
    "Hipotensión",  // 9
    "Infección de la vagina por levaduras",  // 9
    "Infección de las vías urinarias asociada con el uso de catéteres",  // 9
    "Infección de vías urinarias",  // 9
    "Infección lingual",  // 9
    "Infección mamaria",  // 9
    "Infección sinusal",  // 9
    "Inflamación vaginal",  // 9
    "Insuficiencia cardíaca congestiva",  // 9
    "Insuficiencia ovárica prematura",  // 9
    "Intersexualidad",  // 9
    "Leiomioma",  // 9
    "Lesión renal aguda",  // 9
    "Leucemia aguda mieloide",  // 9
    "Leucemia mielógena crónica (LMC)",  // 9
    "Malformación arteriovenosa cerebral",  // 9
    "Mielomeningocele",  // 9
    "Neuritis óptica",  // 9
    "Obstrucción de la unión ureteropélvica",  // 9
    "Pigmentación severa dental",  // 9
    "Pérdida auditiva relacionada con la edad",  // 9
    "Pólipos intestinales",  // 9
    "Queratitis bacteriana",  // 9
    "Reacción alérgica a una droga (medicamento)",  // 9
    "Riñones poliquísticos",  // 9
    "Sangrado nasal",  // 9
    "Shock séptico",  // 9
    "Soplo cardíaco",  // 9
    "Síndrome HELLP",  // 9
    "Síndrome de Cushing",  // 9
    "Taquicardia ventricular",  // 9
    "Tiña de los pies",  // 9
    "Trastorno de conversión",  // 9
    "Trastorno de la personalidad esquizoide",  // 9
    "Trastorno de pánico",  // 9
    "Tricotilomanía",  // 9
    "Uretritis",  // 9
    "Verrugas Anales",  // 9
    "Úlcera labial",  // 9
    "Accidente cardiovascular",  // 8
    "Accidente cerebrovascular cardioembólico",  // 8
    "Accidente cerebrovascular secundario a fibrilación auricular",  // 8
    "Acidosis metabólica",  // 8
    "Adenoma secretante",  // 8
    "Afecciones asociadas con la ictericia",  // 8
    "Alcohol en el embarazo",  // 8
    "Amenorrea",  // 8
    "Aneurisma aórtico",  // 8
    "Aneurisma de la aorta torácica",  // 8
    "Apoplejía",  // 8
    "Arco alto",  // 8
    "Arterioesclerosis de las extremidades",  // 8
    "Artritis cervical",  // 8
    "Asma ocupacional",  // 8
    "Boca de trinchera",  // 8
    "Carcinoma de células transicionales de la vejiga",  // 8
    "Cardiopatía cianótica",  // 8
    "Celulitis preseptal",  // 8
    "Cirrosis biliar primaria",  // 8
    "Cistitis en niños",  // 8
    "Colecistopatía",  // 8
    "Colesteatoma",  // 8
    "Complicaciones en cirugía de obesidad",  // 8
    "Comunicación auriculoventricular",  // 8
    "Congoja",  // 8
    "Convulsión inducida por fiebre",  // 8
    "Cáncer de garganta",  // 8
    "DDC",  // 8
    "Deslizamiento de la epífisis capital femoral",  // 8
    "Enfermedad de Graves",  // 8
    "Enfermedad glomerular lúpica",  // 8
    "Enfermedad ovárica polifolicular",  // 8
    "Enfermedades del colon y recto",  // 8
    "Escleritis",  // 8
    "Espina bífida",  // 8
    "Espolón calcáneo",  // 8
    "Estenosis esofágica benigna",  // 8
    "Estreñimiento en embarazadas",  // 8
    "Familia de tumores de Ewing",  // 8
    "Fascitis necrosante",  // 8
    "Fibrosis pulmonar idiopática",  // 8
    "Fotosensibilidad",  // 8
    "Fístula gastroyeyunocólica",  // 8
    "Glaucoma de ángulo abierto",  // 8
    "Glioma en adultos",  // 8
    "Granulomatosis de Wegener",  // 8
    "Gripe",  // 8
    "Helicobacter pylori",  // 8
    "Hepatitis autoinmunitaria",  // 8
    "Hipoacusia",  // 8
    "Hipogonadismo",  // 8
    "Hiponatremia",  // 8
    "Incontinencia fecal",  // 8
    "Incremento de la presión intracraneal",  // 8
    "Infección de los testículos",  // 8
    "Infección del espacio sublingual",  // 8
    "Infección micótica de piel",  // 8
    "Infección por rotavirus",  // 8
    "Infección renal",  // 8
    "Infección urinaria complicada",  // 8
    "Inflamación de la conjuntiva",  // 8
    "Inflamación del cuello uterino",  // 8
    "Insuficiencia aórtica",  // 8
    "Insuficiencia en el crecimiento",  // 8
    "Insuficiencia placentaria",  // 8
    "Isquemia del colon",  // 8
    "Laringotraqueobronquitis aguda",  // 8
    "Lengua geográfica",  // 8
    "Lesión de la vejiga y la uretra",  // 8
    "Malformaciones arteriovenosas",  // 8
    "Mano Reumática",  // 8
    "Meningitis tuberculosa",  // 8
    "Neumotórax",  // 8
    "Neuropatía del nervio mediano distal",  // 8
    "Oclusión de la arteria retiniana central",  // 8
    "Ojo perezoso",  // 8
    "Osteomielitis",  // 8
    "Parálisis espástica",  // 8
    "Pediculosis",  // 8
    "Peritonitis de tipo secundario",  // 8
    "Polidactilia",  // 8
    "Poliquistosis ovárica",  // 8
    "Prolactinoma",  // 8
    "Pronación del pie",  // 8
    "Pseudotumor cerebral",  // 8
    "Quiste de retención mucosa",  // 8
    "Quiste poplíteo",  // 8
    "Retinopatía serosa central",  // 8
    "Retraso en el crecimiento intrauterino",  // 8
    "Retraso en el desarrollo psicomotor",  // 8
    "Rinitis no alérgica",  // 8
    "Sarcoma de Ewing",  // 8
    "Sarcoma del tejido blando",  // 8
    "Sarcopenia",  // 8
    "Subluxación de la cabeza del radio",  // 8
    "Sífilis",  // 8
    "Síndrome de sueño y vigilia irregulares",  // 8
    "Síndrome de transfusión fetal",  // 8
    "Talalgia",  // 8
    "Tibia vara",  // 8
    "Trastorno ciclotímico",  // 8
    "Trastorno de las matemáticas",  // 8
    "Trastorno del sueño durante el día",  // 8
    "Trastorno psicosomático alimenticio",  // 8
    "Tromboembolia venosa",  // 8
    "Tumor cerebral infratentorial",  // 8
    "Tumor cerebral metastásico (secundario)",  // 8
    "Tímpano perforado",  // 8
    "Uña del pie encarnada",  // 8
    "Viscosuplementacion",  // 8
    "ACV",  // 7
    "Absceso del ano y el recto",  // 7
    "Absceso pancreático",  // 7
    "Accidente cerebrovascular secundario a embolia cardiógena",  // 7
    "Amaurosis fugaz",  // 7
    "Angiodisplasia del colon",  // 7
    "Anomalía de Ebstein",  // 7
    "Antepié varo",  // 7
    "Arterioesclerosis",  // 7
    "Arteriosclerosis",  // 7
    "Arteritis de Takayasu",  // 7
    "Artritis reactiva",  // 7
    "COVID 19",  // 7
    "Carcinoma escamocelular de la piel",  // 7
    "Cervicalgía",  // 7
    "Citomegalovirus (CMV)",  // 7
    "Colitis isquémica",  // 7
    "Colostomia",  // 7
    "Complicaciones en cirugía general",  // 7
    "Conjuntivitis aguda",  // 7
    "Convulsión generalizada",  // 7
    "Crisis epiléptica focal",  // 7
    "Cáncer anal",  // 7
    "Cáncer de la vulva",  // 7
    "Cáncer de paratiroides",  // 7
    "Cáncer de útero",  // 7
    "Cáncer oral",  // 7
    "Dedo supernumerario",  // 7
    "Defecto del canal auriculoventricular",  // 7
    "Defecto septal interventricular",  // 7
    "Derrame ocular",  // 7
    "Desnutrición infantil",  // 7
    "Desprendimiento placentario",  // 7
    "Disección aórtica",  // 7
    "Disfunción placentaria",  // 7
    "Distrofia corneal",  // 7
    "Diástasis de rectos",  // 7
    "Dolor de espalda",  // 7
    "Dolor de oído relacionado con la presión",  // 7
    "Dolor terminal",  // 7
    "Dolor torácico pleurítico",  // 7
    "Endometritis",  // 7
    "Enfermedad de Addison",  // 7
    "Enfermedad de Lyme",  // 7
    "Enfermedades del intestino delgado",  // 7
    "Epiescleritis",  // 7
    "Eritema infeccioso",  // 7
    "Estenosis meatal uretral",  // 7
    "Estomatitis candidósica",  // 7
    "Falla crónica de los riñones",  // 7
    "Foliculitis",  // 7
    "Fístula pre-auricular",  // 7
    "Fístula traqueoesofágica",  // 7
    "Gastroparesia",  // 7
    "Glaucoma congénito",  // 7
    "HIV/SIDA",  // 7
    "Hernia discales",  // 7
    "Hipertensión arterial en bebés",  // 7
    "Hipertensión renal",  // 7
    "Hipertensión renovascular",  // 7
    "Ileostomia",  // 7
    "Incapacidad para concebir",  // 7
    "Infección aguda por VIH",  // 7
    "Infección del Tracto Urinario (ITU)",  // 7
    "Infección micótica de la uña",  // 7
    "Infección por VIH",  // 7
    "Infección urinaria asociada al uso de catéteres",  // 7
    "Infección viral de las vías respiratorias altas",  // 7
    "Inflamación discal",  // 7
    "Insuficiencia renal terminal",  // 7
    "Intoxicación alimentaria",  // 7
    "Lesión maxilofacial",  // 7
    "Linfoma de las células B",  // 7
    "Liquen plano",  // 7
    "Llagas orales (cáncrum oris)",  // 7
    "Malformaciones craneofaciales",  // 7
    "Metatarso aducido",  // 7
    "Neuralgia",  // 7
    "Neuralgia del trigémino",  // 7
    "Obesidad infantil",  // 7
    "Osteoporosis por Climaterio",  // 7
    "Otitis media adhesiva",  // 7
    "Perforación de la membrana timpánica",  // 7
    "Perlas de Epstein",  // 7
    "Polineuropatía sensitivomotora",  // 7
    "Prediabetes",  // 7
    "Presbiacusia",  // 7
    "Pubertad precoz",  // 7
    "Relajación pélvica",  // 7
    "Sindactilia",  // 7
    "Síndrome de Barrett",  // 7
    "Síndrome de Williams",  // 7
    "Síndrome de carencia materna",  // 7
    "Síndrome de distrofia simpática refleja",  // 7
    "Talasemia",  // 7
    "Torsión testicular",  // 7
    "Trastornos hemorrágicos",  // 7
    "Tumor de células gigantes",  // 7
    "Tumor endocrino pancreático",  // 7
    "Tumor medular",  // 7
    "Tumor suprarrenal",  // 7
    "Tumor testicular",  // 7
    "Varicosidad",  // 7
    "Vitreoretinopatía proliferativa",  // 7
    "Várices esofágicas sangrantes",  // 7
    "Íleo del colon"  // 7
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
  ],
}

export default function FeaturedSections() {
  const [expandedSections, setExpandedSections] = useState({
    especialidades: false,
    ciudades: false,
    padecimientos: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  const renderItems = (items: string[], section: string, expanded: boolean) => {
    const displayItems = expanded ? items : items.slice(0, 8)

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {displayItems.map((item) => (
          <Link
            key={item}
            href={`/buscar?tipo=${section === "especialidades" ? "especialidad" : section === "ciudades" ? "ciudad" : "padecimiento"}&valor=${item}`}
            className="text-sm hover:text-primary transition-colors p-2 rounded-md hover:bg-accent"
          >
            {item}
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Especialidades</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => toggleSection("especialidades")} className="h-8 px-2">
            {expandedSections.especialidades ? (
              <>
                <span className="mr-1">Ver menos</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span className="mr-1">Ver más</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {renderItems(FEATURED_DATA.especialidades, "especialidades", expandedSections.especialidades)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Ciudades</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => toggleSection("ciudades")} className="h-8 px-2">
            {expandedSections.ciudades ? (
              <>
                <span className="mr-1">Ver menos</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span className="mr-1">Ver más</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>{renderItems(FEATURED_DATA.ciudades, "ciudades", expandedSections.ciudades)}</CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Padecimientos Atendidos</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => toggleSection("padecimientos")} className="h-8 px-2">
            {expandedSections.padecimientos ? (
              <>
                <span className="mr-1">Ver menos</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span className="mr-1">Ver más</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {renderItems(FEATURED_DATA.padecimientos, "padecimientos", expandedSections.padecimientos)}
        </CardContent>
      </Card>
    </div>
  )
}