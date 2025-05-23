// lib/firebase-server.ts
import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Initialize or reuse existing Firebase Admin app
const app = !getApps().length
  ? initializeApp({ credential: applicationDefault() })
  : getApps()[0]

// Firestore client
const db = getFirestore(app)

// Export both app and db for use elsewhere
export { app as adminApp, db }