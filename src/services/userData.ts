
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, type Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UserData {
  baseHashSpeed: number; // The permanent hash speed
  bonusHashSpeed: number; // The temporary hash speed from bonuses
  earnings: number;
  lastBonusClaimTime: number | null;
  adsWatched: number;
  lastAdResetDate: string | null;
  lastHashResetTime: number | null; // Timestamp of the last hash power reset
  lastUpdated?: Timestamp;
}

export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Ensure baseHashSpeed exists for older user documents
      if (data.baseHashSpeed === undefined) {
        // You might want to initialize hashSpeed to a base value if it's not present
        const oldHashSpeed = data.hashSpeed || 0;
        return {
          ...data,
          baseHashSpeed: 0.01, // Default base hash speed
          bonusHashSpeed: Math.max(0, oldHashSpeed - 0.01)
        } as UserData;
      }
      return data as UserData;
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const createUserData = async (userId: string, data: UserData): Promise<void> => {
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, { ...data, lastUpdated: serverTimestamp() });
  } catch (error) {
    console.error('Error creating user data:', error);
  }
};

export const updateUserData = async (userId: string, data: Partial<UserData>): Promise<void> => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, { ...data, lastUpdated: serverTimestamp() });
  } catch (error) {
    console.error('Error updating user data:', error);
  }
};
