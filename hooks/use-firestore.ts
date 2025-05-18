"use client"

import { useState, useEffect } from "react"
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  limit,
  type DocumentData,
  type QueryConstraint,
  type DocumentReference,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

// Hook for fetching multiple documents
export function useCollection(collectionName: string, constraints: QueryConstraint[] = []) {
  const [data, setData] = useState<DocumentData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const collectionRef = collection(db, collectionName)
        const q = query(collectionRef, ...constraints)
        const querySnapshot = await getDocs(q)

        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setData(documents)
        setError(null)
      } catch (err) {
        console.error("Error fetching collection:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [collectionName, JSON.stringify(constraints)])

  return { data, loading, error }
}

// Hook for fetching a single document
export function useDocument(collectionName: string, documentId: string) {
  const [data, setData] = useState<DocumentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true)
        const docRef = doc(db, collectionName, documentId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setData({
            id: docSnap.id,
            ...docSnap.data(),
          })
        } else {
          setData(null)
        }

        setError(null)
      } catch (err) {
        console.error("Error fetching document:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    if (documentId) {
      fetchDocument()
    }
  }, [collectionName, documentId])

  return { data, loading, error }
}

// Functions for CRUD operations
export const firestoreService = {
  // Create a new document
  async addDocument(collectionName: string, data: DocumentData) {
    try {
      const collectionRef = collection(db, collectionName)
      const docRef = await addDoc(collectionRef, data)
      return { id: docRef.id, ...data }
    } catch (error) {
      console.error("Error adding document:", error)
      throw error
    }
  },

  // Update an existing document
  async updateDocument(collectionName: string, documentId: string, data: Partial<DocumentData>) {
    try {
      const docRef = doc(db, collectionName, documentId)
      await updateDoc(docRef, data)
      return { id: documentId, ...data }
    } catch (error) {
      console.error("Error updating document:", error)
      throw error
    }
  },

  // Delete a document
  async deleteDocument(collectionName: string, documentId: string) {
    try {
      const docRef = doc(db, collectionName, documentId)
      await deleteDoc(docRef)
      return true
    } catch (error) {
      console.error("Error deleting document:", error)
      throw error
    }
  },

  // Get documents with pagination
  async getDocumentsWithPagination(
    collectionName: string,
    pageSize: number,
    startAfterDoc: DocumentReference | null = null,
    constraints: QueryConstraint[] = [],
  ) {
    try {
      const collectionRef = collection(db, collectionName)
      let q = query(collectionRef, ...constraints, limit(pageSize))

      if (startAfterDoc) {
        q = query(q, startAfterDoc)
      }

      const querySnapshot = await getDocs(q)
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]

      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      return {
        documents,
        lastVisible,
      }
    } catch (error) {
      console.error("Error fetching paginated documents:", error)
      throw error
    }
  },
}
