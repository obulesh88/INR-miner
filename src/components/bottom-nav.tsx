
'use client';

import { useState, useEffect } from 'react';
import { Home, Users, Wallet, User, Mail } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import { Skeleton } from './ui/skeleton';

const navItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: Users, label: 'Refer', href: '/referrals' },
  { icon: Wallet, label: 'Wallet', href: '/wallet' },
  { icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleNavClick = (item: (typeof navItems)[0]) => {
    if (item.href) {
      router.push(item.href);
    } else if (item.label === 'Profile') {
      setIsProfileOpen(true);
    }
  };


  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 md:hidden">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-center gap-1 w-full ${
                pathname === item.href ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Dialog */}
      <AlertDialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Your Profile</AlertDialogTitle>
            <AlertDialogDescription>
              This is the email address associated with your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center gap-3 bg-secondary p-3 rounded-md">
            <Mail className="h-5 w-5 text-primary"/>
             {isLoading ? (
              <Skeleton className="h-5 w-40" />
            ) : currentUser ? (
              <p className="text-sm font-medium">{currentUser.email}</p>
            ) : (
              <p className="text-sm font-medium text-muted-foreground">Not logged in</p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsProfileOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
