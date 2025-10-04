
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { type User } from 'firebase/auth';

export interface UserData {
  earnings: number;
  adsWatched: number;
  lastAdResetDate: string | null;
}

const getCurrentUser = (): User => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }
    return user;
}

export const getUserData = async (): Promise<UserData | null> => {
  const user = getCurrentUser();
  const docRef = doc(db, 'users', user.uid);
  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserData;
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
    } else {
        console.error('Error getting user data:', serverError);
    }
    return null;
  }
};

export const createUserData = async (data: UserData): Promise<void> => {
    const user = getCurrentUser();
    const docRef = doc(db, 'users', user.uid);
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

export const updateUserData = async (data: Partial<UserData>): Promise<void> => {
    const user = getCurrentUser();
    const docRef = doc(db, 'users', user.uid);
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
