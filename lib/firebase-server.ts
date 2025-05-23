// lib/firebase-server.ts
import admin from "firebase-admin";

// Initialize or reuse existing Firebase Admin app
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      // Replace literal “\n” in your env var with real newlines
      privateKey:  process.env.FIREBASE_PRIVATE_KEY!
                      .replace(/\\n/g, "\n"),
    }),
  });
}

// Expose both the app and Firestore client
export const adminApp = admin;
export const db       = admin.firestore();
