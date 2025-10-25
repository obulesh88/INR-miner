
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { type User } from 'firebase/auth';

export interface Withdrawal {
    amount: number;
    upiId: string;
    status: 'Pending' | 'Completed' | 'Failed';
}

export interface UserData {
  earnings: number;
  adsWatched: number;
  lastAdResetDate: string | null;
  withdrawals: Withdrawal[];
  lastAdWatchedTimestamp: number | null;
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
      const data = docSnap.data() as UserData;
      if (data.withdrawals) {
        // Since there's no date, we can just show them in the order they are in the array (which is newest first with arrayUnion)
         data.withdrawals = data.withdrawals.reverse(); // To show latest first
      }
      return data;
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

    const dataToUpdate: { [key: string]: any } = { ...data };

    if (data.withdrawals && data.withdrawals.length > 0) {
        const newWithdrawalRequest = data.withdrawals[0];
        // Use arrayUnion to add the new withdrawal object.
        dataToUpdate.withdrawals = arrayUnion(newWithdrawalRequest);
    }

    return updateDoc(docRef, dataToUpdate)
        .catch((serverError) => {
             if (serverError.code === 'permission-denied') {
                const permissionError = new FirestorePermissionError({
                    path: docRef.path,
                    operation: 'update',
                    requestResourceData: dataToUpdate,
                });
                errorEmitter.emit('permission-error', permissionError);
             } else {
                 console.error('Error updating user data:', serverError);
             }
             // Re-throw the error so the calling component can handle it
             throw serverError;
        });
};
