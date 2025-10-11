
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, arrayUnion, FieldValue } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { type User } from 'firebase/auth';

export interface Withdrawal {
    amount: number;
    upiId: string;
    date: any; // Can be Date, null, FieldValue, or a placeholder string
    status: 'Pending' | 'Completed' | 'Failed';
}

export interface UserData {
  earnings: number;
  adsWatched: number;
  lastAdResetDate: string | null;
  withdrawals: Withdrawal[];
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
      // Convert Firestore Timestamps to JS Date objects
      if (data.withdrawals) {
        data.withdrawals = data.withdrawals.map(w => ({
            ...w,
            date: w.date?.toDate ? w.date.toDate() : w.date // handle Timestamps and other types
        })).sort((a, b) => (b.date?.getTime ? b.date.getTime() : 0) - (a.date?.getTime ? a.date.getTime() : 0));
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
        const withdrawalWithTimestamp = {
            ...newWithdrawalRequest,
            date: serverTimestamp() 
        };
        // Use arrayUnion to add the new withdrawal object.
        // This is an atomic operation.
        dataToUpdate.withdrawals = arrayUnion(withdrawalWithTimestamp);
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
