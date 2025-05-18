"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false)
    }, 5000)

    if (!auth) {
      console.error("Firebase auth is not initialized")
      setLoading(false)
      clearTimeout(timeoutId)
      return () => {}
    }

    // Set up the Firebase Auth state observer
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user)
        setLoading(false)
        clearTimeout(timeoutId)
      },
      (error) => {
        console.error("Auth state change error:", error)
        setLoading(false)
        clearTimeout(timeoutId)
      },
    )

    // Clean up the observer when the component unmounts
    return () => {
      unsubscribe()
      clearTimeout(timeoutId)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      throw new Error("Firebase authentication is not initialized")
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const signOut = async () => {
    if (!auth) {
      throw new Error("Firebase authentication is not initialized")
    }

    try {
      await firebaseSignOut(auth)
    } catch (error: any) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
