// app/fix-specialties/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { firestore } from '@/lib/firebase-admin'  // adjust to your path
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore'

// your wrong→right map
const corrections: Record<string,string> = {
  "Acupuntor": "Acupuntura",
    "Alergología": "Alergología",
    "Alergólogo": "Alergología",
    "Algólogo": "Medicina del Dolor y Algología",
    "Anatomopatólogo": "Patología (Anatómica y Clínica)",
    "Anatomía patológica": "Patología (Anatómica y Clínica)",
    "Anestesiología": "Anestesiología",
    "Anestesiólogo": "Anestesiología",
    "Angiología y cirugia vascular": "Cirugía Vascular y Angiología",
    "Angiólogo": "Angiología",
    "Audiología": "Audiología",
    "Audiólogo": "Audiología",
    "Cardiología": "Cardiología",
    "Cardiólogo": "Cardiología",
    "Cardiólogo pediátrico": "Cardiología Pediátrica",
    "Cirugía cardiovascular y del tórax": "Cirugía Cardiotorácica",
    "Cirugía de la mano": "Ortopedia y Traumatología",
    "Cirugía estética y cosmética": "Medicina Estética y Reconstructiva",
    "Cirugía general": "Cirugía General",
    "Cirugía maxilofacial": "Cirugía Maxilofacial",
    "Cirugía oncológica": "Cirugía Oncológica",
    "Cirugía pediátrica": "Cirugía Pediátrica",
    "Cirugía plástica": "Medicina Estética y Reconstructiva",
    "Cirujano bariatra": "Cirugía Bariátrica",
    "Cirujano cardiovascular": "Cirugía Cardiotorácica",
    "Cirujano cardiovascular y torácico": "Cirugía Cardiotorácica",
    "Cirujano de la mano": "Ortopedia y Traumatología",
    "Cirujano estético y cosmético": "Medicina Estética y Reconstructiva",
    "Cirujano general": "Cirugía General",
    "Cirujano maxilofacial": "Cirugía Maxilofacial",
    "Cirujano oncólogo": "Cirugía Oncológica",
    "Cirujano pediátrico": "Cirugía Pediátrica",
    "Cirujano plástico": "Medicina Estética y Reconstructiva",
    "Cirujano torácico": "Cirugía Cardiotorácica",
    "Cirujano vascular": "Cirugía Vascular y Angiología",
    "Dentista - Odontólogo": "Odontología",
    "Dermatología": "Dermatología",
    "Dermatología pediátrica": "Dermatología Pediátrica",
    "Dermatólogo": "Dermatología",
    "Dermatólogo pediátrico": "Dermatología Pediátrica",
    "Diabetología": "Endocrinología, Diabetes y Metabolismo",
    "Diabetólogo": "Endocrinología, Diabetes y Metabolismo",
    "Endocrinología": "Endocrinología, Diabetes y Metabolismo",
    "Endocrinólogo": "Endocrinología, Diabetes y Metabolismo",
    "Endocrinólogo pediátrico": "Endocrinología Pediátrica",
    "Endoscopia": "Endoscopia",
    "Endoscopista": "Endoscopia",
    "Enfermero": "Enfermería",
    "Enfermería": "Enfermería",
    "Especialidad en Medicina del Enfermo Pediátrico en Estado Crítico": "Medicina del Enfermo Pediátrico en Estado Crítico",
    "Especialista en Medicina Crítica y Terapia Intensiva": "Medicina de Urgencias y Cuidados Intensivos",
    "Especialista en Medicina del Deporte": "Medicina del Deporte",
    "Especialista en Medicina del Trabajo": "Salud Pública y Medicina Preventiva",
    "Especialista en Medicina Integrada": "Medicina Integrativa y Complementaria",
    "Especialista en Obesidad y Delgadez": "Endocrinología, Diabetes y Metabolismo",
    "Especialista en Rehabilitación y Medicina Física": "Rehabilitación y Medicina Física",
    "Especialista en Retina Médica y Quirúrgica": "Retina Médica y Quirúrgica",
    "estética y reconstructiva": "Medicina Estética y Reconstructiva",
    "Fisioterapeuta": "Fisioterapia",
    "Fisioterapia": "Fisioterapia",
    "Gastroenterología": "Gastroenterología",
    "Gastroenterología pediátrica": "Gastroenterología Pediátrica",
    "Gastroenterólogo": "Gastroenterología",
    "Gastroenterólogo pediátrico": "Gastroenterología Pediátrica",
    "Genetista": "Genética",
    "Genética": "Genética",
    "Geriatra": "Geriatría",
    "Geriatría": "Geriatría",
    "gerontologo": "Salud Pública y Medicina Preventiva",
    "Ginecología y obstetricia": "Ginecología y Obstetricia",
    "Ginecólogo": "Ginecología y Obstetricia",
    "Ginecólogo oncológico": "Ginecología Oncológica",
    "Hematología": "Hematología",
    "Hematólogo": "Hematología",
    "Hematólogo pediatra": "Hematología Pediátrica",
    "Homeopatía": "Homeopatía",
    "Homeópata": "Homeopatía",
    "Infectología": "Infectología",
    "Infectólogo": "Infectología",
    "Infectólogo pediatra": "Infectología Pediátrica",
    "Inmunología": "Inmunología",
    "Inmunólogo": "Inmunología",
    "Internista": "Medicina Interna",
    "Laboratorio-análisis clínicos": "Laboratorio Clínico",
    "Logopeda": "Logopedia",
    "Logopedia": "Logopedia",
    "Medicina complementaria": "Medicina Integrativa y Complementaria",
    "Medicina crítica y terapia intensiva": "Medicina de Urgencias y Cuidados Intensivos",
    "Medicina del deporte": "Medicina del Deporte",
    "Medicina del trabajo": "Salud Pública y Medicina Preventiva",
    "Medicina estética": "Medicina Estética y Reconstructiva",
    "Medicina familiar": "Medicina Familiar",
    "Medicina general": "Medicina General",
    "Medicina integrada": "Medicina Integrativa y Complementaria",
    "Medicina interna": "Medicina Interna",
    "Medicina nuclear": "Radiología y Diagnóstico por Imagen",
    "Medicina preventiva": "Salud Pública y Medicina Preventiva",
    "Médico de familia": "Medicina Familiar",
    "Médico estético": "Medicina Estética y Reconstructiva",
    "Médico general": "Medicina General",
    "Naturista": "Naturopatía",
    "Naturopatía": "Naturopatía",
    "Nefrología": "Nefrología",
    "Nefrólogo": "Nefrología",
    "Nefrólogo pediatra": "Nefrología Pediátrica",
    "Neonatología": "Neonatología",
    "Neonatólogo": "Neonatología",
    "Neumología": "Neumología",
    "Neumología pediátrica": "Neumología Pediátrica",
    "Neumólogo": "Neumología",
    "Neumólogo pediatra": "Neumología Pediátrica",
    "Neurocirugía": "Neurocirugía",
    "Neurocirujano": "Neurocirugía",
    "Neurofisiología": "Neurofisiología",
    "Neurofisiólogo": "Neurofisiología",
    "Neurología": "Neurología",
    "Neurólogo": "Neurología",
    "Neurólogo pediatra": "Neurología Pediátrica",
    "Nutricionista": "Nutrición y Dietética",
    "Nutrición": "Nutrición y Dietética",
    "Nutriología clínica": "Nutrición y Dietética",
    "Nutriólogo clínico": "Nutrición y Dietética",
    "Obesidad y delgadez": "Endocrinología, Diabetes y Metabolismo",
    "Odontología": "Odontología",
    "Odontología pediatra": "Odontología Pediátrica",
    "Odontólogo pediatra": "Odontología Pediátrica",
    "Oftalmología": "Oftalmología",
    "Oftalmología pediátrica": "Oftalmología Pediátrica",
    "Oftalmólogo": "Oftalmología",
    "Oftalmólogo pediátrico": "Oftalmología Pediátrica",
    "Oncología médica": "Oncología Médica",
    "Oncólogo médico": "Oncología Médica",
    "Oncólogo pediátrico": "Oncología Pediátrica",
    "Optometrista": "Optometría",
    "Optometría": "Optometría",
    "Ortodoncista": "Ortodoncia",
    "Ortopedia": "Ortopedia y Traumatología",
    "Ortopedia pediátrica": "Ortopedia Pediátrica",
    "Ortopedista": "Ortopedia y Traumatología",
    "Ortopedista infantil": "Ortopedia Pediátrica",
    "otoneurología y foniatría": "Otoneurología y Foniatría",
    "Otorrinolaringología": "Otorrinolaringología",
    "Otorrinolaringología pediátrica": "Otorrinolaringología Pediátrica",
    "Otorrinolaringólogo": "Otorrinolaringología",
    "Otorrinolaringólogo Pediátrico": "Otorrinolaringología Pediátrica",
    "Patología clínica": "Patología (Anatómica y Clínica)",
    "Patólogo Bucal": "Patología Bucal",
    "Patólogo clínico": "Patología (Anatómica y Clínica)",
    "Pediatra": "Pediatría",
    "Pediatría": "Pediatría",
    "Podiatra": "Podología y Podiatría",
    "Podiatría": "Podología y Podiatría",
    "Podología": "Podología y Podiatría",
    "Podólogo": "Podología y Podiatría",
    "Proctología": "Proctología",
    "Proctólogo": "Proctología",
    "Psicoanalista": "Psicología",
    "Psicoanálisis": "Psicología",
    "Psicología": "Psicología",
    "Psicopedagogo": "Psicopedagogía",
    "Psicopedagogía": "Psicopedagogía",
    "Psicólogo": "Psicología",
    "Psiquiatra": "Psiquiatría",
    "Psiquiatra infantil": "Psiquiatría Infantil",
    "Psiquiatría": "Psiquiatría",
    "Quiropráctica": "Quiropráctica",
    "Quiropráctico": "Quiropráctica",
    "Radio Oncólogo": "Radiooncología",
    "Radiología": "Radiología y Diagnóstico por Imagen",
    "Radioterapeuta": "Radiooncología",
    "Radiólogo": "Radiología y Diagnóstico por Imagen",
    "Rehabilitación y medicina física": "Rehabilitación y Medicina Física",
    "Retina médica y quirúrgica": "Retina Médica y Quirúrgica",
    "Reumatología": "Reumatología",
    "Reumatólogo": "Reumatología",
    "Reumatólogo pediátrico": "Reumatología Pediátrica",
    "Sexología": "Sexología",
    "Sexólogo": "Sexología",
    "Terapeuta complementario": "Medicina Integrativa y Complementaria",
    "Terapeuta ocupacional": "Terapia Ocupacional",
    "Terapia del dolor": "Medicina del Dolor y Algología",
    "Terapia ocupacional": "Terapia Ocupacional",
    "Traumatología": "Ortopedia y Traumatología",
    "Traumatólogo": "Ortopedia y Traumatología",
    "Técnico en diagnóstico e imagen": "Radiología y Diagnóstico por Imagen",
    "Urgencias": "Medicina de Urgencias y Cuidados Intensivos",
    "Urgenciólogo": "Medicina de Urgencias y Cuidados Intensivos",
    "Urología": "Urología",
    "Urología pediátrica": "Urología Pediátrica",
    "Urólogo": "Urología"
}

const BATCH_SIZE = 400     // max writes per batch before commit & pause
const READ_LIMIT = 500       // docs to fetch per page
const PAUSE_MS   = 200       // pause between commits (ms)

function fixArray(arr: string[]): string[] {
  // replace via corrections map, then dedupe while preserving order
  const mapped = arr.map(v => corrections[v] ?? v)
  return Array.from(new Set(mapped))
}

async function migrateAll(startAfter?: QueryDocumentSnapshot) {
  // 1) page through doctors collection
  let q = firestore
            .collection('doctors')
            .orderBy('__name__')
            .limit(READ_LIMIT)
  if (startAfter) q = q.startAfter(startAfter)

  const snap = await q.get()
  if (snap.empty) return

  // 2) batch & throttle updates
  let batch = firestore.batch()
  let ops   = 0

  for (const doc of snap.docs) {
    const data = doc.data()
    if (!Array.isArray(data.specialties)) continue

    const fixed = fixArray(data.specialties)
    const changed = (
      fixed.length !== data.specialties.length ||
      fixed.some((v, i) => v !== data.specialties[i])
    )

    if (changed) {
      batch.update(doc.ref, { specialties: fixed })
      ops++
    }

    if (ops >= BATCH_SIZE) {
      await batch.commit()
      await new Promise(r => setTimeout(r, PAUSE_MS))
      batch = firestore.batch()
      ops = 0
    }
  }

  // commit any leftover writes
  if (ops > 0) {
    await batch.commit()
    await new Promise(r => setTimeout(r, PAUSE_MS))
  }

  // recurse to next page
  const lastDoc = snap.docs[snap.docs.length - 1]
  await migrateAll(lastDoc)
}

export async function GET(request: NextRequest) {
  // simple token auth
  const token = request.nextUrl.searchParams.get('token')
  if (token !== process.env.MIGRATE_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await migrateAll()
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
