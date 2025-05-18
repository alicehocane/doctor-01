export type ActivityType = "add" | "update" | "delete" | "other"

export interface Activity {
  type: ActivityType
  description: string
  timestamp: Date
  userId?: string
  entityId?: string
  entityType?: string
}

// Use localStorage for activities
const LOCAL_ACTIVITIES_KEY = "doctor_directory_activities"

// Helper to save activities to localStorage
function saveActivityToLocalStorage(activity: any) {
  try {
    const existingActivities = getActivitiesFromLocalStorage()
    const newActivity = {
      ...activity,
      id: `local_${Date.now()}`,
      timestamp: new Date(),
    }

    // Add to beginning of array (newest first)
    existingActivities.unshift(newActivity)

    // Keep only the latest 20 activities
    const limitedActivities = existingActivities.slice(0, 20)

    localStorage.setItem(LOCAL_ACTIVITIES_KEY, JSON.stringify(limitedActivities))
    return newActivity.id
  } catch (error) {
    console.error("Error saving activity to localStorage:", error)
    return null
  }
}

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

export async function logActivity(activity: Omit<Activity, "timestamp">) {
  try {
    if (typeof window === "undefined") {
      console.log("Window not available, cannot log activity")
      return null
    }

    console.log("Logging activity:", activity)

    const activityData = {
      ...activity,
      timestamp: new Date(),
    }

    return saveActivityToLocalStorage(activityData)
  } catch (error) {
    console.error("Error logging activity:", error)
    return null
  }
}

export async function getRecentActivities(count = 5) {
  try {
    if (typeof window === "undefined") {
      console.log("Window not available, cannot get activities")
      return []
    }

    console.log("Fetching recent activities from localStorage...")
    const localActivities = getActivitiesFromLocalStorage().slice(0, count)
    console.log(`Retrieved ${localActivities.length} activities from localStorage`)
    return localActivities
  } catch (error) {
    console.error("Error fetching recent activities:", error)
    return []
  }
}
