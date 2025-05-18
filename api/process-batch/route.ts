import { type NextRequest, NextResponse } from "next/server"
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { generateDoctorId, ensureUniqueDoctorId } from "@/lib/utils-doctor"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    // Obtener el lote de médicos del cuerpo de la solicitud
    const lote = await request.json()

    if (!Array.isArray(lote)) {
      return NextResponse.json(
        {
          exito: false,
          mensaje: "Formato inválido: se esperaba un array",
          exitosos: 0,
          errores: 1,
          listaErrores: [{ medico: "N/A", error: "Formato inválido: se esperaba un array" }],
        },
        { status: 400 },
      )
    }

    // Resultados para este lote
    let exitosos = 0
    let errores = 0
    const listaErrores: { medico: string; error: string }[] = []

    // Procesar cada médico en el lote
    for (const medico of lote) {
      try {
        // Validar campos requeridos
        if (
          !medico.fullName ||
          !medico.licenseNumber ||
          !medico.specialties ||
          !medico.cities ||
          !medico.phoneNumbers ||
          !Array.isArray(medico.specialties) ||
          !Array.isArray(medico.cities) ||
          !Array.isArray(medico.phoneNumbers)
        ) {
          errores++
          listaErrores.push({
            medico: medico.fullName || "Médico sin nombre",
            error: "Campos requeridos faltantes o formato incorrecto",
          })
          continue
        }

        // Generar ID del médico
        const idBase = generateDoctorId(medico.fullName)
        const doctorId = await ensureUniqueDoctorId(idBase)

        // Añadir timestamp e ID
        const medicoConMeta = {
          ...medico,
          doctorId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }

        // Guardar en Firestore
        const docRef = doc(collection(db, "doctors"))
        await setDoc(docRef, medicoConMeta)

        exitosos++
      } catch (error) {
        errores++
        listaErrores.push({
          medico: medico.fullName || "Médico sin nombre",
          error: error instanceof Error ? error.message : "Error desconocido",
        })
      }
    }

    // Revalidar la ruta de médicos si se añadió alguno correctamente
    if (exitosos > 0) {
      revalidatePath("/admin/doctors")
    }

    return NextResponse.json({
      exito: errores === 0,
      mensaje: `Lote procesado: ${exitosos} éxitos, ${errores} errores.`,
      exitosos,
      errores,
      listaErrores,
    })
  } catch (error) {
    console.error("Error al procesar lote:", error)
    return NextResponse.json(
      {
        exito: false,
        mensaje: "Error al procesar el lote: " + (error instanceof Error ? error.message : "Error desconocido"),
        exitosos: 0,
        errores: 1,
        listaErrores: [{ medico: "N/A", error: "Error al procesar el lote" }],
      },
      { status: 500 },
    )
  }
}
