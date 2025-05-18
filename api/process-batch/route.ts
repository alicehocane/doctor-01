import { type NextRequest, NextResponse } from "next/server"
import { processSingleDoctor } from "@/app/actions/bulk-upload-doctors"

export async function POST(request: NextRequest) {
  try {
    // Obtener el lote de doctores del cuerpo de la solicitud
    const batch = await request.json()

    if (!Array.isArray(batch)) {
      return NextResponse.json(
        {
          success: false,
          message: "Formato inválido: se esperaba un array",
          successCount: 0,
          errorCount: 1,
          errors: [{ doctor: "N/A", error: "Formato inválido: se esperaba un array" }],
        },
        { status: 400 },
      )
    }

    // Resultados para este lote
    let successCount = 0
    let errorCount = 0
    const errors: { doctor: string; error: string }[] = []

    // Procesar cada doctor en el lote
    for (const doctor of batch) {
      try {
        const result = await processSingleDoctor(doctor)
        successCount += result.successCount
        errorCount += result.errorCount
        errors.push(...result.errors)
      } catch (error) {
        errorCount++
        errors.push({
          doctor: doctor.fullName || "Médico sin nombre",
          error: error instanceof Error ? error.message : "Error desconocido",
        })
      }
    }

    return NextResponse.json({
      success: errorCount === 0,
      message: `Lote procesado: ${successCount} éxitos, ${errorCount} errores.`,
      successCount,
      errorCount,
      errors,
    })
  } catch (error) {
    console.error("Error al procesar lote:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al procesar el lote: " + (error instanceof Error ? error.message : "Error desconocido"),
        successCount: 0,
        errorCount: 1,
        errors: [{ doctor: "N/A", error: "Error al procesar el lote" }],
      },
      { status: 500 },
    )
  }
}
