
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, type Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UserData {
  hashSpeed: number; // All hash speed is now temporary
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
      // Ensure data structure is up-to-date, reset if old structure is detected
      if (data.baseHashSpeed !== undefined || data.bonusHashSpeed !== undefined) {
          return null; // This will trigger a reset in the dashboard
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
