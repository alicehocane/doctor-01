import { type NextRequest, NextResponse } from "next/server"

// Almacenamiento temporal en memoria (en producción deberías usar una solución más robusta)
const TEMP_STORAGE = new Map<string, string>()

export async function POST(request: NextRequest) {
  try {
    // Obtener el JSON del cuerpo de la solicitud
    const jsonData = await request.text()

    // Generar un ID único para este lote de datos
    const uploadId = Date.now().toString() + Math.random().toString(36).substring(2, 15)

    // Almacenar los datos temporalmente
    TEMP_STORAGE.set(uploadId, jsonData)

    // Devolver el ID para recuperar los datos más tarde
    return NextResponse.json({ success: true, uploadId })
  } catch (error) {
    console.error("Error al almacenar datos temporales:", error)
    return NextResponse.json({ success: false, error: "Error al procesar la carga" }, { status: 500 })
  }
}

// Función para obtener datos almacenados (para uso interno)
export function getTempData(uploadId: string): string | null {
  return TEMP_STORAGE.get(uploadId) || null
}

// Función para eliminar datos después de procesarlos
export function deleteTempData(uploadId: string): void {
  TEMP_STORAGE.delete(uploadId)
}
