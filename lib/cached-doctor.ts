// lib/cached-doctor.ts
import { getDoctorData } from './get-doctor';

const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache

const doctorCache = new Map<string, {
  data: Awaited<ReturnType<typeof getDoctorData>>;
  timestamp: number;
}>();

export async function getCachedDoctorData(id: string) {
  const cached = doctorCache.get(id);
  
  // Return cached data if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Fetch fresh data
  const doctor = await getDoctorData(id);
  doctorCache.set(id, {
    data: doctor,
    timestamp: Date.now()
  });
  
  return doctor;
}