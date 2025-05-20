"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight, AlertCircle, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { collection, getDocs, deleteDoc, doc, query, orderBy, writeBatch } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { logActivity } from "@/lib/activity-logger"

// Cache keys
const CACHE_KEYS = {
  DOCTORS: 'doctorsList_doctors',
  TIMESTAMP: 'doctorsList_timestamp'
}

// Cache expiration time (1 hour)
const CACHE_EXPIRY = 60 * 60 * 1000

export default function DoctorsList() {
  const { toast } = useToast()
  const [doctors, setDoctors] = useState<any[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("nombre")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null)
  const [connectionIssue, setConnectionIssue] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Bulk operations state
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([])
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [bulkActionLoading, setBulkActionLoading] = useState(false)

  const itemsPerPage = 10

  const getCachedData = (key: string) => {
    const cached = localStorage.getItem(key)
    return cached ? JSON.parse(cached) : null
  }

  const setCachedData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data))
    localStorage.setItem(CACHE_KEYS.TIMESTAMP, new Date().getTime().toString())
  }

  const isCacheValid = () => {
    const cachedTime = localStorage.getItem(CACHE_KEYS.TIMESTAMP)
    if (!cachedTime) return false
    return (new Date().getTime() - parseInt(cachedTime)) < CACHE_EXPIRY
  }

  const fetchDoctors = async (forceRefresh = false) => {
    setLoading(true)
    setError(null)
    setConnectionIssue(false)

    try {
      // Check cache first if not forcing refresh
      if (!forceRefresh && isCacheValid()) {
        const cachedDoctors = getCachedData(CACHE_KEYS.DOCTORS)
        if (cachedDoctors) {
          setDoctors(cachedDoctors)
          setFilteredDoctors(cachedDoctors)
          setLoading(false)
          return
        }
      }

      if (!db) {
        throw new Error("Firestore is not initialized")
      }

      const doctorsRef = collection(db, "doctors")
      let fetchedDoctors: any[] = []

      try {
        // Try to fetch with createdAt sorting first
        const createdAtQuery = query(doctorsRef, orderBy("createdAt", "desc"))
        const createdAtSnapshot = await getDocs(createdAtQuery)

        fetchedDoctors = createdAtSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      } catch (sortError) {
        console.warn("Error fetching with createdAt sort, falling back to name sort:", sortError)
      }

      // If no results with createdAt, fall back to fullName sorting
      if (fetchedDoctors.length === 0) {
        const nameQuery = query(doctorsRef, orderBy("fullName"))
        const nameSnapshot = await getDocs(nameQuery)

        fetchedDoctors = nameSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      }

      // If we still have no results, try getting all doctors without sorting
      if (fetchedDoctors.length === 0) {
        const allDocsSnapshot = await getDocs(doctorsRef)

        fetchedDoctors = allDocsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      }

      setDoctors(fetchedDoctors)
      setFilteredDoctors(fetchedDoctors)
      setCachedData(CACHE_KEYS.DOCTORS, fetchedDoctors)
    } catch (error: any) {
      console.error("Error fetching doctors:", error)
      setError(error.message || "Failed to fetch doctors")

      // Check if this might be a browser extension blocking issue
      if (error.message.includes("timeout") || error.code === "permission-denied" || error.name === "FirebaseError") {
        setConnectionIssue(true)
      }

      // Try to use cached data if available
      const cachedDoctors = getCachedData(CACHE_KEYS.DOCTORS)
      if (cachedDoctors) {
        setDoctors(cachedDoctors)
        setFilteredDoctors(cachedDoctors)
      } else {
        // Fallback to mock data only if no cache exists
        const mockDoctors = [
          {
            id: "mock1",
            fullName: "Dr. Luis Felipe Aguilar Aguilar",
            specialties: ["Cardiólogo", "Angiólogo"],
            cities: ["Monterrey", "Guadalajara"],
            createdAt: new Date().toISOString(),
          },
          {
            id: "mock2",
            fullName: "Dra. María González Rodríguez",
            specialties: ["Pediatra", "Neonatólogo"],
            cities: ["Ciudad de México", "Puebla"],
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
        ]
        setDoctors(mockDoctors)
        setFilteredDoctors(mockDoctors)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [refreshKey])

  // Filter doctors based on search criteria
  useEffect(() => {
    if (!searchTerm) {
      setFilteredDoctors(doctors)
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = doctors.filter((doctor) => {
      if (searchType === "nombre") {
        return doctor.fullName.toLowerCase().includes(term)
      } else if (searchType === "especialidad") {
        return (
          doctor.specialties && doctor.specialties.some((specialty: string) => specialty.toLowerCase().includes(term))
        )
      } else if (searchType === "ciudad") {
        return doctor.cities && doctor.cities.some((city: string) => city.toLowerCase().includes(term))
      }
      return true
    })

    setFilteredDoctors(filtered)
    setCurrentPage(1)
  }, [searchTerm, searchType, doctors])

  // Calculate pagination
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDeleteClick = (id: string) => {
    setDoctorToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!doctorToDelete) return

    try {
      // Get doctor name before deletion for the activity log
      const doctorToDeleteData = doctors.find((doctor) => doctor.id === doctorToDelete)
      const doctorName = doctorToDeleteData?.fullName || "Unknown doctor"

      // Delete from Firestore
      if (db) {
        await deleteDoc(doc(db, "doctors", doctorToDelete))

        // Log the activity
        await logActivity({
          type: "delete",
          description: `Médico eliminado: ${doctorName}`,
          entityId: doctorToDelete,
          entityType: "doctor",
        })
      }

      // Update local state and cache
      const updatedDoctors = doctors.filter((doctor) => doctor.id !== doctorToDelete)
      setDoctors(updatedDoctors)
      setFilteredDoctors(updatedDoctors)
      setCachedData(CACHE_KEYS.DOCTORS, updatedDoctors)

      toast({
        title: "Médico eliminado",
        description: "El médico ha sido eliminado exitosamente",
      })
    } catch (error: any) {
      console.error("Error deleting doctor:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el médico. Intente de nuevo.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setDoctorToDelete(null)
    }
  }

  // Function to format date display
  const formatDate = (dateValue: any) => {
    if (!dateValue) return "N/A"

    try {
      // Handle Firestore Timestamp
      if (dateValue && typeof dateValue === "object" && "seconds" in dateValue) {
        return new Date(dateValue.seconds * 1000).toLocaleDateString()
      }

      // Handle string date
      if (typeof dateValue === "string") {
        return new Date(dateValue).toLocaleDateString()
      }

      // Handle Date object
      if (dateValue instanceof Date) {
        return dateValue.toLocaleDateString()
      }

      return "N/A"
    } catch (error) {
      console.error("Error formatting date:", error)
      return "N/A"
    }
  }

  // Bulk selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDoctors(paginatedDoctors.map((doctor) => doctor.id))
    } else {
      setSelectedDoctors([])
    }
  }

  const handleSelectDoctor = (doctorId: string, checked: boolean) => {
    if (checked) {
      setSelectedDoctors((prev) => [...prev, doctorId])
    } else {
      setSelectedDoctors((prev) => prev.filter((id) => id !== doctorId))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedDoctors.length === 0) return

    setBulkActionLoading(true)

    try {
      if (db) {
        const batch = writeBatch(db)

        // Get doctor names for activity log
        const selectedDoctorNames = doctors
          .filter((doctor) => selectedDoctors.includes(doctor.id))
          .map((doctor) => doctor.fullName)

        // Add each doctor to the batch delete
        selectedDoctors.forEach((doctorId) => {
          const docRef = doc(db, "doctors", doctorId)
          batch.delete(docRef)
        })

        // Commit the batch
        await batch.commit()

        // Log the activity
        await logActivity({
          type: "delete",
          description: `Eliminación masiva: ${selectedDoctors.length} médicos`,
          entityType: "doctors",
        })

        // Update local state and cache
        const remainingDoctors = doctors.filter((doctor) => !selectedDoctors.includes(doctor.id))
        setDoctors(remainingDoctors)
        setFilteredDoctors(remainingDoctors)
        setCachedData(CACHE_KEYS.DOCTORS, remainingDoctors)

        toast({
          title: "Médicos eliminados",
          description: `${selectedDoctors.length} médicos han sido eliminados exitosamente`,
        })
      }
    } catch (error: any) {
      console.error("Error deleting doctors in bulk:", error)
      toast({
        title: "Error",
        description: "No se pudieron eliminar algunos médicos. Intente de nuevo.",
        variant: "destructive",
      })
    } finally {
      setBulkDeleteDialogOpen(false)
      setSelectedDoctors([])
      setBulkActionLoading(false)
    }
  }

  const refreshDoctors = () => {
    setRefreshKey((prev) => prev + 1)
  }

  // Check if all visible doctors are selected
  const allSelected =
    paginatedDoctors.length > 0 && paginatedDoctors.every((doctor) => selectedDoctors.includes(doctor.id))

  // Check if some visible doctors are selected
  const someSelected = paginatedDoctors.some((doctor) => selectedDoctors.includes(doctor.id)) && !allSelected

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Lista de Médicos</h1>
          <p className="text-muted-foreground">Gestiona los médicos en el directorio.</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshDoctors}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button asChild>
            <Link href="/admin/doctors/add">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Médico
            </Link>
          </Button>
        </div>
      </div>

      {connectionIssue && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium">Problema de conexión detectado</div>
            <p className="mt-1">
              Es posible que un bloqueador de anuncios o extensión de navegador esté impidiendo la conexión con
              Firebase. Intente desactivar extensiones o usar el modo incógnito.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {error && !connectionIssue && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar médicos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={searchType} onValueChange={setSearchType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Buscar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nombre">Nombre</SelectItem>
            <SelectItem value="especialidad">Especialidad</SelectItem>
            <SelectItem value="ciudad">Ciudad</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk actions bar - only show when items are selected */}
      {selectedDoctors.length > 0 && (
        <div className="bg-muted p-2 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{selectedDoctors.length} médicos seleccionados</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="destructive" size="sm" onClick={() => setBulkDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Seleccionados
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedDoctors([])}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={allSelected}
                  ref={(ref) => {
                    if (ref) {
                      ref.indeterminate = someSelected
                    }
                  }}
                  onCheckedChange={handleSelectAll}
                  aria-label="Seleccionar todos"
                />
              </TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Especialidades</TableHead>
              <TableHead>Ciudades</TableHead>
              <TableHead>Creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6} className="h-16">
                    <div className="w-full h-4 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedDoctors.length > 0 ? (
              paginatedDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedDoctors.includes(doctor.id)}
                      onCheckedChange={(checked) => handleSelectDoctor(doctor.id, !!checked)}
                      aria-label={`Seleccionar ${doctor.fullName}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{doctor.fullName}</TableCell>
                  <TableCell>{doctor.specialties ? doctor.specialties.join(", ") : ""}</TableCell>
                  <TableCell>{doctor.cities ? doctor.cities.join(", ") : ""}</TableCell>
                  <TableCell>{formatDate(doctor.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/doctor/${doctor.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver</span>
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/doctors/edit/${doctor.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteClick(doctor.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron médicos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Single doctor delete dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El médico será eliminado permanentemente del directorio.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk delete dialog */}
      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar {selectedDoctors.length} médicos?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Los médicos seleccionados serán eliminados permanentemente del
              directorio.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDeleteDialogOpen(false)} disabled={bulkActionLoading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete} disabled={bulkActionLoading}>
              {bulkActionLoading ? <>Eliminando...</> : <>Eliminar {selectedDoctors.length} médicos</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
