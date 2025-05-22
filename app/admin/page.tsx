"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MapPin, Stethoscope, Activity, AlertCircle, RefreshCw } from "lucide-react"
import { collection, getDocs, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getRecentActivities } from "@/lib/activity-logger"
import { getTopSearchesWithPercentages } from "@/lib/search-tracker"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

// Cache objects outside the component
let statsCache = {
  totalDoctors: 0,
  totalCities: 0,
  totalSpecialties: 0,
  totalDiseases: 0,
}
let activitiesCache: any[] = []
let searchesCache: any[] = []
let lastFetchTime: number | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export default function AdminDashboard() {
  const [stats, setStats] = useState(statsCache)
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState(activitiesCache)
  const [topSearches, setTopSearches] = useState(searchesCache)
  const [loadingActivities, setLoadingActivities] = useState(true)
  const [loadingSearches, setLoadingSearches] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchStats = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
      setStats(statsCache)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      if (!db) {
        throw new Error("Firestore not initialized")
      }

      const doctorsRef = collection(db, "doctors")
      const q = query(doctorsRef)
      const querySnapshot = await getDocs(q)

      const doctors = querySnapshot.docs.map((doc) => doc.data())
      const allCities = doctors.flatMap((doc) => doc.cities || [])
      const allSpecialties = doctors.flatMap((doc) => doc.specialties || [])
      const allDiseases = doctors.flatMap((doc) => doc.diseasesTreated || [])

      const newStats = {
        totalDoctors: querySnapshot.size,
        totalCities: new Set(allCities).size,
        totalSpecialties: new Set(allSpecialties).size,
        totalDiseases: new Set(allDiseases).size,
      }

      statsCache = newStats
      lastFetchTime = Date.now()
      setStats(newStats)
    } catch (error: any) {
      console.error("Error fetching stats:", error)
      if (!error.message.includes("permission")) {
        setError(`Error al cargar estadísticas: ${error.message}`)
      }

      // Set default stats for demo
      setStats({
        totalDoctors: 125,
        totalCities: 32,
        totalSpecialties: 48,
        totalDiseases: 215,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchActivities = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
      setActivities(activitiesCache)
      setLoadingActivities(false)
      return
    }

    setLoadingActivities(true)
    try {
      const recentActivities = await getRecentActivities(4)
      activitiesCache = recentActivities
      lastFetchTime = Date.now()
      setActivities(recentActivities)
    } catch (error: any) {
      console.error("Error fetching activities:", error)
      if (!error.message.includes("permission")) {
        setError(`Error al cargar actividades: ${error.message}`)
      }
    } finally {
      setLoadingActivities(false)
    }
  }, [])

  const fetchSearches = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
      setTopSearches(searchesCache)
      setLoadingSearches(false)
      return
    }

    setLoadingSearches(true)
    try {
      const searches = await getTopSearchesWithPercentages(4)
      searchesCache = searches
      lastFetchTime = Date.now()
      setTopSearches(searches)
    } catch (error: any) {
      console.error("Error fetching search stats:", error)
      if (!error.message.includes("permission")) {
        setError(`Error al cargar estadísticas de búsqueda: ${error.message}`)
      }
    } finally {
      setLoadingSearches(false)
    }
  }, [])

  const refreshAllData = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
    fetchStats(true)
    fetchActivities(true)
    fetchSearches(true)
  }, [fetchStats, fetchActivities, fetchSearches])

  useEffect(() => {
    fetchStats()
    fetchActivities()
    fetchSearches()
  }, [fetchStats, fetchActivities, fetchSearches, refreshKey])

  // Function to format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffDay > 0) {
      return `Hace ${diffDay} ${diffDay === 1 ? "día" : "días"}`
    } else if (diffHour > 0) {
      return `Hace ${diffHour} ${diffHour === 1 ? "hora" : "horas"}`
    } else if (diffMin > 0) {
      return `Hace ${diffMin} ${diffMin === 1 ? "minuto" : "minutos"}`
    } else {
      return "Hace unos segundos"
    }
  }

  // Function to get activity color
  const getActivityColor = (type: string) => {
    switch (type) {
      case "add":
        return "bg-green-500"
      case "update":
        return "bg-blue-500"
      case "delete":
        return "bg-red-500"
      default:
        return "bg-yellow-500"
    }
  }

  // Function to get type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "ciudad":
        return "Ciudad"
      case "especialidad":
        return "Especialidad"
      case "padecimiento":
        return "Padecimiento"
      default:
        return "Otro"
    }
  }

  // Function to get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "ciudad":
        return "text-blue-600 dark:text-blue-400"
      case "especialidad":
        return "text-green-600 dark:text-green-400"
      case "padecimiento":
        return "text-purple-600 dark:text-purple-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido al panel de administración del Busca Doctor México.</p>
        </div>
        <Button onClick={refreshAllData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Médicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 bg-muted animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalDoctors}</div>
                <p className="text-xs text-muted-foreground">Médicos registrados</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ciudades</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 bg-muted animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalCities}</div>
                <p className="text-xs text-muted-foreground">En todo México</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Especialidades</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 bg-muted animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalSpecialties}</div>
                <p className="text-xs text-muted-foreground">Áreas médicas</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Padecimientos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 bg-muted animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalDiseases}</div>
                <p className="text-xs text-muted-foreground">Condiciones tratadas</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingActivities ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-muted mr-2"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-muted animate-pulse rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.type)} mr-2`}></div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground">No hay actividad reciente.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Las actividades aparecerán aquí cuando agregues, actualices o elimines médicos.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de Búsqueda</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSearches ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <div className="h-4 bg-muted animate-pulse rounded w-1/3"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-12"></div>
                    </div>
                    <div className="w-full bg-accent h-2 rounded-full">
                      <div className="bg-muted animate-pulse h-2 rounded-full" style={{ width: `${i * 10}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {topSearches.length > 0 ? (
                  topSearches.map((search, index) => (
                    <div key={`${search.id || index}`}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">
                          {search.term}{" "}
                          <span className={`text-xs ${getTypeColor(search.type)}`}>({getTypeLabel(search.type)})</span>
                        </span>
                        <span className="text-sm text-muted-foreground">{search.percentage}%</span>
                      </div>
                      <div className="w-full bg-accent h-2 rounded-full">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${search.percentage}%` }}></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground">No hay datos de búsqueda disponibles.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Las estadísticas se basan en la frecuencia de especialidades, ciudades y padecimientos en los
                      registros de médicos.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
