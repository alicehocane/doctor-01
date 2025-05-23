// lib/firebase-server.ts
import admin from "firebase-admin";

// Initialize or reuse existing Firebase Admin app with service-account credentials
if (!admin.apps.length) {
  const serviceAccount = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      client_email: process.env.FIREBASE_CLIENT_EMAIL!,
    private_key:  process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  };

  admin.initializeApp({
    credential: admin.credential.cert(
      serviceAccount as admin.ServiceAccount
    ),
  });
}

// Firestore client
export const db = admin.firestore();
