
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
  updateUserData: (newUserData: Partial<UserData>) => void;
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
    let firebaseData = await getUserData(currentUser.uid);
    let dataToSet: UserData;

    const today = getToday();
    const localAdsWatchedRaw = localStorage.getItem(
      `adsWatched_${currentUser.uid}`
    );
    const localAdsData = localAdsWatchedRaw
      ? JSON.parse(localAdsWatchedRaw)
      : { count: 0, date: null };

    if (firebaseData) {
      dataToSet = firebaseData;
    } else {
      const newUserData: UserData = {
        ...initialUserData,
        lastAdResetDate: today,
      };
      await createUserData(currentUser.uid, newUserData);
      dataToSet = newUserData;
    }

    if (dataToSet.lastAdResetDate !== today) {
      dataToSet.adsWatched = 0;
      dataToSet.lastAdResetDate = today;
      await updateFirebaseUserData(currentUser.uid, {
        adsWatched: 0,
        lastAdResetDate: today,
      });
    }

    if (localAdsData.date === today && localAdsData.count > dataToSet.adsWatched) {
      dataToSet.adsWatched = localAdsData.count;
    } else {
      localStorage.setItem(
        `adsWatched_${currentUser.uid}`,
        JSON.stringify({ count: dataToSet.adsWatched, date: today })
      );
    }

    setUserData(dataToSet);
  }, []);

  const updateUserData = useCallback(
    (newUserData: Partial<UserData>) => {
      if (!user) return;

      setUserData((prev) => {
        const updatedData = { ...(prev || initialUserData), ...newUserData };
        updateFirebaseUserData(user.uid, updatedData);

        if (newUserData.adsWatched !== undefined) {
          localStorage.setItem(
            `adsWatched_${user.uid}`,
            JSON.stringify({ count: newUserData.adsWatched, date: getToday() })
          );
        }

        return updatedData;
      });
    },
    [user]
  );
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsLoading(true);
        loadUserData(currentUser).finally(() => setIsLoading(false));
      } else {
        setUserData(initialUserData);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [loadUserData]);

  useEffect(() => {
    if (!user || !userData) return;

    const saveInterval = setInterval(() => {
      if (userData.earnings > 0) {
        updateFirebaseUserData(user.uid, { earnings: userData.earnings });
      }
    }, 30000); // Save earnings every 30 seconds

    return () => clearInterval(saveInterval);
  }, [user, userData]);

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
