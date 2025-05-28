import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function getDoctorData(id: string) {
  try {
    const docRef = doc(db, "doctors", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return null;
  }
}