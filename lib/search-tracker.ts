import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface SearchQuery {
  term: string
  type: "ciudad" | "especialidad" | "padecimiento"
  count: number
  percentage: number
}

// Use localStorage for activities
const LOCAL_ACTIVITIES_KEY = "doctor_directory_activities"
const LOCAL_SEARCHES_KEY = "doctor_directory_searches"

// Helper to get activities from localStorage
function getActivitiesFromLocalStorage() {
  try {
    if (typeof window === "undefined") return []

    const activitiesJson = localStorage.getItem(LOCAL_ACTIVITIES_KEY)
    if (!activitiesJson) return []

    const activities = JSON.parse(activitiesJson)
    return activities.map((activity: any) => ({
      ...activity,
      timestamp: new Date(activity.timestamp),
    }))
  } catch (error) {
    console.error("Error getting activities from localStorage:", error)
    return []
  }
}

// Helper to save search to localStorage
function saveSearchToLocalStorage(searchType: string, searchValue: string) {
  try {
    if (typeof window === "undefined") return false

    const type =
      searchType === "ciudad" || searchType === "especialidad" || searchType === "padecimiento" ? searchType : "other"

    const searchId = `${type}_${searchValue.toLowerCase().replace(/\s+/g, "_")}`

    // Get existing searches
    const existingSearches = getSearchesFromLocalStorage()

    // Check if this search already exists
    const existingSearchIndex = existingSearches.findIndex((s) => s.id === searchId)

    if (existingSearchIndex >= 0) {
      // Update existing search
      existingSearches[existingSearchIndex].count += 1
      existingSearches[existingSearchIndex].lastSearched = new Date()
    } else {
      // Add new search
      existingSearches.push({
        id: searchId,
        term: searchValue,
        type,
        count: 1,
        firstSearched: new Date(),
        lastSearched: new Date(),
      })
    }

    localStorage.setItem(LOCAL_SEARCHES_KEY, JSON.stringify(existingSearches))
    return true
  } catch (error) {
    console.error("Error saving search to localStorage:", error)
    return false
  }
}

// Helper to get searches from localStorage
function getSearchesFromLocalStorage() {
  try {
    if (typeof window === "undefined") return []

    const searchesJson = localStorage.getItem(LOCAL_SEARCHES_KEY)
    if (!searchesJson) return []

    const searches = JSON.parse(searchesJson)
    return searches.map((search: any) => ({
      ...search,
      firstSearched: new Date(search.firstSearched),
      lastSearched: new Date(search.lastSearched),
    }))
  } catch (error) {
    console.error("Error getting searches from localStorage:", error)
    return []
  }
}

export async function trackSearch(searchType: string, searchValue: string) {
  try {
    if (typeof window === "undefined") return false

    console.log(`Tracking search: ${searchType} - ${searchValue}`)
    return saveSearchToLocalStorage(searchType, searchValue)
  } catch (error) {
    console.error("Error tracking search:", error)
    return false
  }
}

// Generate statistics from actual doctor data with correct percentage calculations
export async function generateRealSearchStatistics(count = 4) {
  try {
    if (!db) {
      console.error("Firestore not initialized")
      return []
    }

    // Fetch all doctors
    const doctorsRef = collection(db, "doctors")
    const querySnapshot = await getDocs(doctorsRef)

    if (querySnapshot.empty) {
      console.log("No doctors found")
      return []
    }

    // Collect all specialties, cities, and conditions
    const specialtiesMap = new Map()
    const citiesMap = new Map()
    const conditionsMap = new Map()
    let totalDoctors = 0

    querySnapshot.forEach((doc) => {
      totalDoctors++
      const data = doc.data()

      // Count specialties
      if (data.specialties && Array.isArray(data.specialties)) {
        data.specialties.forEach((specialty: string) => {
          const count = specialtiesMap.get(specialty) || 0
          specialtiesMap.set(specialty, count + 1)
        })
      }

      // Count cities
      if (data.cities && Array.isArray(data.cities)) {
        data.cities.forEach((city: string) => {
          const count = citiesMap.get(city) || 0
          citiesMap.set(city, count + 1)
        })
      }

      // Count conditions/diseases
      if (data.diseasesTreated && Array.isArray(data.diseasesTreated)) {
        data.diseasesTreated.forEach((disease: string) => {
          const count = conditionsMap.get(disease) || 0
          conditionsMap.set(disease, count + 1)
        })
      }
    })

    // Calculate percentages within each category
    const calculatePercentage = (count: number, total: number) => {
      return Math.round((count / total) * 100)
    }

    // Convert maps to arrays with percentages and sort by count
    const totalSpecialties = Array.from(specialtiesMap.values()).reduce((sum, count) => sum + count, 0)
    const specialties = Array.from(specialtiesMap.entries())
      .map(([term, count]) => ({
        id: `especialidad_${term.toLowerCase().replace(/\s+/g, "_")}`,
        term,
        type: "especialidad",
        count,
        percentage: calculatePercentage(count, totalSpecialties),
      }))
      .sort((a, b) => b.count - a.count)

    const totalCities = Array.from(citiesMap.values()).reduce((sum, count) => sum + count, 0)
    const cities = Array.from(citiesMap.entries())
      .map(([term, count]) => ({
        id: `ciudad_${term.toLowerCase().replace(/\s+/g, "_")}`,
        term,
        type: "ciudad",
        count,
        percentage: calculatePercentage(count, totalCities),
      }))
      .sort((a, b) => b.count - a.count)

    const totalConditions = Array.from(conditionsMap.values()).reduce((sum, count) => sum + count, 0)
    const conditions = Array.from(conditionsMap.entries())
      .map(([term, count]) => ({
        id: `padecimiento_${term.toLowerCase().replace(/\s+/g, "_")}`,
        term,
        type: "padecimiento",
        count,
        percentage: calculatePercentage(count, totalConditions),
      }))
      .sort((a, b) => b.count - a.count)

    // Take top items from each category
    const topSpecialties = specialties.slice(0, Math.ceil(count / 3))
    const topCities = cities.slice(0, Math.ceil(count / 3))
    const topConditions = conditions.slice(0, Math.ceil(count / 3))

    // Combine all stats
    const combinedStats = [...topCities, ...topSpecialties, ...topConditions]

    // Sort by count for final display order
    combinedStats.sort((a, b) => b.count - a.count)

    // Take the top items overall, but ensure we have at least one from each category if available
    let finalStats = []

    // First, ensure we have at least one from each category if available
    if (topCities.length > 0) finalStats.push(topCities[0])
    if (topSpecialties.length > 0) finalStats.push(topSpecialties[0])
    if (topConditions.length > 0) finalStats.push(topConditions[0])

    // Then fill remaining slots with highest counts
    const remainingSlots = count - finalStats.length
    if (remainingSlots > 0) {
      // Get items not already included
      const remainingItems = combinedStats.filter((item) => !finalStats.some((stat) => stat.id === item.id))

      // Add top remaining items
      finalStats = [...finalStats, ...remainingItems.slice(0, remainingSlots)]

      // Sort by count
      finalStats.sort((a, b) => b.count - a.count)
    }

    console.log("Generated statistics:", finalStats)
    return finalStats
  } catch (error) {
    console.error("Error generating real search statistics:", error)
    return []
  }
}

export async function getTopSearches(count = 4) {
  try {
    // Try to get real statistics
    try {
      const realStats = await generateRealSearchStatistics(count)
      if (realStats && realStats.length > 0) {
        console.log("Using real statistics from doctor data")
        return realStats
      }
    } catch (error) {
      console.error("Error getting real statistics:", error)
    }

    // If we couldn't get real statistics, return empty array
    return []
  } catch (error) {
    console.error("Error fetching top searches:", error)
    return []
  }
}

export async function getTopSearchesWithPercentages(count = 4) {
  try {
    const topSearches = await getTopSearches(count)
    return topSearches
  } catch (error) {
    console.error("Error calculating search percentages:", error)
    return []
  }
}
