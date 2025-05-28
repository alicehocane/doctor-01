// lib/firebase-server.ts
import admin from "firebase-admin";

// Check if Firebase Admin is already initialized to prevent multiple instances
const firebaseAdminConfig = {
  credential: admin.credential.cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
};

// Initialize only once
const app = admin.apps.length === 0 
  ? admin.initializeApp(firebaseAdminConfig)
  : admin.apps[0];

// Get Firestore instance
export const db = app?.firestore();

// Helper function to safely access Firestore
export async function getServerDoc(collection: string, id: string) {
  try {
    if (!db) throw new Error("Firestore not initialized");
    const docRef = db.collection(collection).doc(id);
    const docSnap = await docRef.get();
    
    return docSnap.exists ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error("Firestore error:", error);
    return null;
  }
}