import { type NextRequest, NextResponse } from "next/server"
import { getTempData, deleteTempData } from "../upload-temp/route"
import { processSingleDoctor } from "@/app/actions/bulk-upload-doctors"

export async function POST(request: NextRequest) {
  try {
    const { uploadId, startIndex, endIndex } = await request.json()

    // Obtener los datos almacenados temporalmente
    const jsonData = getTempData(uploadId)
    if (!jsonData) {
      return NextResponse.json({ success: false, error: "Datos no encontrados o expirados" }, { status: 404 })
    }

    // Parsear los datos JSON
    const doctors = JSON.parse(jsonData)

    if (!Array.isArray(doctors)) {
      return NextResponse.json({ success: false, error: "Formato inválido: se esperaba un array" }, { status: 400 })
    }

    // Obtener el lote específico para procesar
    const chunk = doctors.slice(startIndex, endIndex)

    // Resultados para este lote
    const results = {
      successCount: 0,
      errorCount: 0,
      errors: [] as { doctor: string; error: string }[],
    }

    // Procesar cada doctor en el lote
    for (const doctor of chunk) {
      const result = await processSingleDoctor(doctor)

      results.successCount += result.successCount
      results.errorCount += result.errorCount
      results.errors.push(...result.errors)
    }

    // Si este es el último lote, eliminar los datos temporales
    if (endIndex >= doctors.length) {
      deleteTempData(uploadId)
    }

    return NextResponse.json({
      success: true,
      results,
      isComplete: endIndex >= doctors.length,
      totalRecords: doctors.length,
    })
  } catch (error) {
    console.error("Error al procesar lote:", error)
    return NextResponse.json({ success: false, error: "Error al procesar el lote" }, { status: 500 })
  }
}
