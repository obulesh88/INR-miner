
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export interface UserData {
  earnings: number;
  adsWatched: number;
  lastAdResetDate: string | null;
}

export const getUserData = async (userId: string): Promise<UserData | null> => {
  const docRef = doc(db, 'users', userId);
  try {
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
  } catch (serverError: any) {
    if (serverError.code === 'permission-denied') {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
    }
    console.error('Error getting user data:', serverError);
    return null;
  }
};

export const createUserData = async (userId: string, data: UserData): Promise<void> => {
    const docRef = doc(db, 'users', userId);
    setDoc(docRef, data)
        .catch((serverError) => {
            if (serverError.code === 'permission-denied') {
                const permissionError = new FirestorePermissionError({
                    path: docRef.path,
                    operation: 'create',
                    requestResourceData: data,
                });
                errorEmitter.emit('permission-error', permissionError);
            } else {
                console.error('Error creating user data:', serverError);
            }
        });
};

export const updateUserData = async (userId: string, data: Partial<UserData>): Promise<void> => {
    const docRef = doc(db, 'users', userId);
    updateDoc(docRef, data)
        .catch((serverError) => {
             if (serverError.code === 'permission-denied') {
                const permissionError = new FirestorePermissionError({
                    path: docRef.path,
                    operation: 'update',
                    requestResourceData: data,
                });
                errorEmitter.emit('permission-error', permissionError);
            } else {
                console.error('Error updating user data:', serverError);
            }
        });
};
