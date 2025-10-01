
'use client';

import { useState, useEffect } from 'react';
import { Home, Users, Wallet, User, Mail, LogOut } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';

const navItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: Users, label: 'Refer', href: '/referrals' },
  { icon: Wallet, label: 'Wallet', href: '/wallet' },
  { icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      setIsProfileOpen(false);
      router.push('/login');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'Something went wrong. Please try again.',
      });
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
             <AlertDialogCancel>Close</AlertDialogCancel>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
