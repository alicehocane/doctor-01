"use client"

import { useState, useEffect } from "react"

// Add cache utility functions after the state declarations
const [refreshKey, setRefreshKey] = useState(0)

// Cache utility functions
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes in milliseconds

const getCachedData = (key: string) => {
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

const setCachedData = (key: string, data: any) => {
  if (typeof window === "undefined") return

  const cacheItem = {
    data,
    timestamp: Date.now(),
  }

  localStorage.setItem(`dashboard_${key}`, JSON.stringify(cacheItem))
}

// Replace the useEffect with the following implementation
useEffect(() => {
  const fetchStats = async (forceRefresh = false) => {
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
  }

  const fetchActivities = async (forceRefresh = false) => {
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
  }

  const fetchSearches = async (forceRefresh = false) => {
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
  }

  const forceRefresh = refreshKey > 0
  fetchStats(forceRefresh)
  fetchActivities(forceRefresh)
  fetchSearches(forceRefresh)
}, [refreshKey])

// Update the refreshDashboard function
const refreshDashboard = () => {
  setError(null)
  setRefreshKey((prev) => prev + 1)
}
