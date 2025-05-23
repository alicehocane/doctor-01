// lib/firebaseAdmin.ts
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Ensure Admin SDK is initialized once
if (!getApps().length) {
  initializeApp({ credential: applicationDefault() })
}

// Export Firestore under a clear name
export const adminDb = getFirestore()
