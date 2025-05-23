// lib/firebaseAdmin.ts
import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const firebaseAdminConfig = {
  credential: applicationDefault(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

if (!getApps().length) {
  initializeApp(firebaseAdminConfig)
}

const adminDb = getFirestore()

export { adminDb }
