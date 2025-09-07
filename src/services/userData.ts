
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UserData {
  hashSpeed: number;
  earnings: number;
  lastBonusClaimTime: number | null;
  adsWatched: number;
  lastAdResetDate: string | null;
}

export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserData;
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
