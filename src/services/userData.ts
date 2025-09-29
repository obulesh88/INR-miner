
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UserData {
  earnings: number;
  adsWatched: number;
  lastAdResetDate: string | null;
}

export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Backward compatibility check for old data structure
      if (data.hashSpeed !== undefined || data.lastBonusClaimTime !== undefined) {
        return {
            earnings: data.earnings || 0,
            adsWatched: data.adsWatched || 0,
            lastAdResetDate: data.lastAdResetDate || null
        };
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
    await setDoc(docRef, data);
  } catch (error) {
    console.error('Error creating user data:', error);
  }
};

export const updateUserData = async (userId: string, data: Partial<UserData>): Promise<void> => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating user data:', error);
  }
};
