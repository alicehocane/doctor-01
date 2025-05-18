"use client"

import { useState, useEffect } from "react"
import { app, auth, db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function FirebaseTest() {
  const [status, setStatus] = useState<{
    initialized: boolean
    firestore: boolean
    auth: boolean
    error: string | null
  }>({
    initialized: false,
    firestore: false,
    auth: false,
    error: null,
  })

  useEffect(() => {
    async function testFirebase() {
      try {
        // Check if Firebase is initialized
        if (!app || !auth || !db) {
          setStatus({
            initialized: false,
            firestore: false,
            auth: false,
            error: "Firebase is not properly initialized",
          })
          return
        }

        setStatus((prev) => ({ ...prev, initialized: true }))

        // Test Firestore
        try {
          const querySnapshot = await getDocs(collection(db, "doctors"))
          setStatus((prev) => ({ ...prev, firestore: true }))
        } catch (error: any) {
          console.error("Firestore test error:", error)
          setStatus((prev) => ({ ...prev, error: `Firestore error: ${error.message}` }))
        }

        // Test Auth (just check if it's initialized)
        if (auth) {
          setStatus((prev) => ({ ...prev, auth: true }))
        }
      } catch (error: any) {
        console.error("Firebase test error:", error)
        setStatus((prev) => ({ ...prev, error: error.message }))
      }
    }

    testFirebase()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firebase Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span>Firebase Initialized:</span>
          {status.initialized ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <span>Firestore Connection:</span>
          {status.firestore ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <span>Auth Service:</span>
          {status.auth ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
        </div>

        {status.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{status.error}</AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground mt-4">
          <p>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✓ Set" : "✗ Not Set"}</p>
          <p>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✓ Set" : "✗ Not Set"}</p>
          <p>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✓ Set" : "✗ Not Set"}</p>
        </div>
      </CardContent>
    </Card>
  )
}
