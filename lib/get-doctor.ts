import { firestore } from './firebase-admin';

interface Doctor {
  id: string;
  fullName: string;
  name?: string; // Fallback field
  specialties: string[];
  cities: string[];
  phoneNumbers: string[];
  diseasesTreated?: string[];
}

export async function getDoctorData(id: string): Promise<Doctor | null> {
  try {
    const docRef = firestore.collection('doctors').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.warn(`Doctor not found with ID: ${id}`);
      return null;
    }

    const data = docSnap.data();
    
    // Transform and validate data
    return {
      id: docSnap.id,
      fullName: data?.fullName || data?.name || 'Nombre no disponible',
      specialties: data?.specialties || [],
      cities: data?.cities || [],
      phoneNumbers: data?.phoneNumbers || data?.phones || [],
      diseasesTreated: data?.diseasesTreated || [],
    };
  } catch (error) {
    console.error(`Error fetching doctor ${id}:`, error);
    
    // Handle quota errors specifically
    if (error.code === 8 || error.message.includes('RESOURCE_EXHAUSTED')) {
      console.warn('Firestore quota exceeded, implementing fallback');
      // Add your fallback logic here if needed
    }
    
    return null;
  }
}