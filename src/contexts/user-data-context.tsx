
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
} from '@/services/userData';

const initialUserData: UserData = {
  earnings: 0.0,
  adsWatched: 0,
  lastAdResetDate: null,
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
    setIsLoading(true);
    let firebaseData = await getUserData(currentUser.uid);
    let dataToSet: UserData;

    const today = getToday();

    if (firebaseData) {
      // If the last reset date is not today, reset adsWatched
      if (firebaseData.lastAdResetDate !== today) {
        firebaseData.adsWatched = 0;
        firebaseData.lastAdResetDate = today;
        await updateFirebaseUserData(currentUser.uid, { adsWatched: 0, lastAdResetDate: today });
      }
      dataToSet = firebaseData;
    } else {
      // If no data exists, create it
      const newUserData: UserData = {
        ...initialUserData,
        lastAdResetDate: today,
      };
      await createUserData(currentUser.uid, newUserData);
      dataToSet = newUserData;
    }

    setUserData(dataToSet);
    setIsLoading(false);
  }, []);

  const updateUserData = useCallback(
    async (newUserData: Partial<UserData>) => {
      if (!user || !userData) return;
  
      const updatedData = { ...userData, ...newUserData };
      setUserData(updatedData);

      try {
        await updateFirebaseUserData(user.uid, newUserData);
      } catch (error) {
        console.error("Failed to update user data in Firebase:", error);
        // Optionally, revert state or show an error to the user
        // For now, we'll just log it. The state is already updated optimistically.
      }
    },
    [user, userData]
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
