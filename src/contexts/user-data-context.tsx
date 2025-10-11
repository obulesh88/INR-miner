
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  getUserData,
  createUserData,
  updateUserData as updateFirebaseUserData,
  type UserData,
  type Withdrawal,
} from '@/services/userData';

const initialUserData: UserData = {
  earnings: 0.0,
  adsWatched: 0,
  lastAdResetDate: null,
  withdrawals: [],
};

interface UserDataContextType {
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
  updateUserData: (newUserData: Partial<UserData>) => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getToday = () => new Date().toISOString().split('T')[0];

  const loadUserData = useCallback(async (currentUser: User) => {
    if (!currentUser) {
      setUserData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let firebaseData = await getUserData();
    let dataToSet: UserData;

    const today = getToday();

    if (firebaseData) {
      if (firebaseData.lastAdResetDate !== today) {
        firebaseData.adsWatched = 0;
        firebaseData.lastAdResetDate = today;
        await updateFirebaseUserData({ adsWatched: 0, lastAdResetDate: today });
      }
      dataToSet = firebaseData;
    } else {
      const newUserData: UserData = {
        ...initialUserData,
        lastAdResetDate: today,
      };
      await createUserData(newUserData);
      dataToSet = newUserData;
    }

    setUserData(dataToSet);
    setIsLoading(false);
  }, []);

  const updateUserData = useCallback(
    async (newUserData: Partial<UserData>) => {
      const currentUser = auth.currentUser;
      if (!currentUser || !userData) return;
  
      const previousUserData = { ...userData };
  
      // Optimistically update local state first
      const updatedData = { ...userData, ...newUserData };
      if (newUserData.withdrawals && newUserData.withdrawals.length > 0 && userData.withdrawals) {
        const newWithdrawal = {
          ...newUserData.withdrawals[0],
          date: new Date(), // Use client date for optimistic update
        };
        updatedData.withdrawals = [newWithdrawal, ...userData.withdrawals];
      }
      setUserData(updatedData);
  
      try {
        await updateFirebaseUserData(newUserData);
        // After successful Firebase update, reload the data
        // to get server-timestamps and ensure consistency.
        if(user) {
          await loadUserData(user);
        }
      } catch (error) {
        console.error("Failed to update user data in Firebase:", error);
        // Revert optimistic update on failure
        setUserData(previousUserData);
        throw error; // Re-throw the error to be caught by the calling component
      }
    },
    [userData, user, loadUserData]
  );
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadUserData(currentUser);
      } else {
        setUserData(null);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [loadUserData]);

  const value = { user, userData, isLoading, updateUserData };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
