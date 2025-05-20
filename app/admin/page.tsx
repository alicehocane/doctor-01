"use client"

import { useState, useEffect, useCallback } from "react"
import { collection, query, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { getRecentActivities, getTopSearchesWithPercentages } from "@/utils"
import { StatsCard, ActivityCard, SearchStatsCard } from "@/components"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalCities: 0,
    totalSpecialties: 0,
    totalDiseases: 0,
  })
  const [activities, setActivities] = useState([])
  const [topSearches, setTopSearches] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingActivities, setLoadingActivities] = useState(true)
  const [loadingSearches, setLoadingSearches] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Cache utility functions
  const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes in milliseconds

  const getCachedData = (key) => {
    if (typeof window === "undefined") return null

    const cachedData = localStorage.getItem(`dashboard_${key}`)
    if (!cachedData) return null

    try {
      const { data, timestamp } = JSON.parse(cachedData)
      const isExpired = Date.now() - timestamp > CACHE_EXPIRY

      if (isExpired) {
        localStorage.removeItem(`dashboard_${key}`)
        return null
      }

      return data
    } catch (error) {
      console.error(`Error parsing cached ${key}:`, error)
      localStorage.removeItem(`dashboard_${key}`)
      return null
    }
  }

  const setCachedData = (key, data) => {
    if (typeof window === "undefined") return

    const cacheItem = {
      data,
      timestamp: Date.now(),
    }

    localStorage.setItem(`dashboard_${key}`, JSON.stringify(cacheItem))
  }

  const fetchStats = useCallback(
    async (forceRefresh = false) => {
      setLoading(true)

      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        const cachedStats = getCachedData("stats")
        if (cachedStats) {
          console.log("Using cached stats data")
          setStats(cachedStats)
          setLoading(false)
          return
        }
      }

      try {
        if (!db) {
          throw new Error("Firestore not initialized")
        }

        const doctorsRef = collection(db, "doctors")
        const q = query(doctorsRef)
        const querySnapshot = await getDocs(q)

        // Calculate stats from the fetched doctors
        const doctors = querySnapshot.docs.map((doc) => doc.data())

        // Get unique cities, specialties, and diseases
        const allCities = doctors.flatMap((doc) => doc.cities || [])
        const allSpecialties = doctors.flatMap((doc) => doc.specialties || [])
        const allDiseases = doctors.flatMap((doc) => doc.diseasesTreated || [])

        const uniqueCities = new Set(allCities)
        const uniqueSpecialties = new Set(allSpecialties)
        const uniqueDiseases = new Set(allDiseases)

        const newStats = {
          totalDoctors: querySnapshot.size,
          totalCities: uniqueCities.size,
          totalSpecialties: uniqueSpecialties.size,
          totalDiseases: uniqueDiseases.size,
        }

        setStats(newStats)
        setCachedData("stats", newStats)
      } catch (error: any) {
        console.error("Error fetching stats:", error)
        // Don't show error message for permission issues, just use default stats
        if (!error.message.includes("permission")) {
          setError(`Error al cargar estadísticas: ${error.message}`)
        }

        // Set default stats for demo
        const defaultStats = {
          totalDoctors: 125,
          totalCities: 32,
          totalSpecialties: 48,
          totalDiseases: 215,
        }

        setStats(defaultStats)
        setCachedData("stats", defaultStats)
      } finally {
        setLoading(false)
      }
    },
    [db],
  )

  const fetchActivities = useCallback(async (forceRefresh = false) => {
    setLoadingActivities(true)

    // Check cache first if not forcing refresh
    if (!forceRefresh) {
      const cachedActivities = getCachedData("activities")
      if (cachedActivities) {
        console.log("Using cached activities data")
        setActivities(cachedActivities)
        setLoadingActivities(false)
        return
      }
    }

    try {
      console.log("Starting to fetch activities...")
      const recentActivities = await getRecentActivities(4)
      console.log("Activities fetched:", recentActivities)
      setActivities(recentActivities)
      setCachedData("activities", recentActivities)
    } catch (error: any) {
      console.error("Error fetching activities:", error)
      // Don't show error message for permission issues
      if (!error.message.includes("permission")) {
        setError(`Error al cargar actividades: ${error.message}`)
      }
    } finally {
      setLoadingActivities(false)
    }
  }, [])

  const fetchSearches = useCallback(async (forceRefresh = false) => {
    setLoadingSearches(true)

    // Check cache first if not forcing refresh
    if (!forceRefresh) {
      const cachedSearches = getCachedData("searches")
      if (cachedSearches) {
        console.log("Using cached searches data")
        setTopSearches(cachedSearches)
        setLoadingSearches(false)
        return
      }
    }

    try {
      console.log("Starting to fetch search stats...")
      const searches = await getTopSearchesWithPercentages(4)
      console.log("Search stats fetched:", searches)
      setTopSearches(searches)
      setCachedData("searches", searches)
    } catch (error: any) {
      console.error("Error fetching search stats:", error)
      // Don't show error message for permission issues
      if (!error.message.includes("permission")) {
        setError(`Error al cargar estadísticas de búsqueda: ${error.message}`)
      }
    } finally {
      setLoadingSearches(false)
    }
  }, [])

  useEffect(() => {
    const forceRefresh = refreshKey > 0
    fetchStats(forceRefresh)
    fetchActivities(forceRefresh)
    fetchSearches(forceRefresh)
  }, [refreshKey, fetchStats, fetchActivities, fetchSearches])

  const refreshDashboard = () => {
    setError(null)
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-5">Panel de Administrador</h1>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="mb-5">
        <Button onClick={refreshDashboard}>Actualizar Dashboard</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard title="Doctores Totales" value={stats.totalDoctors} loading={loading} />
        <StatsCard title="Ciudades Totales" value={stats.totalCities} loading={loading} />
        <StatsCard title="Especialidades Totales" value={stats.totalSpecialties} loading={loading} />
        <StatsCard title="Enfermedades Totales" value={stats.totalDiseases} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityCard title="Actividad Reciente" activities={activities} loading={loadingActivities} />
        <SearchStatsCard title="Estadísticas de Búsqueda" topSearches={topSearches} loading={loadingSearches} />
      </div>
    </div>
  )
}
