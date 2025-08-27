
'use client';

import { useState } from 'react';
import { Home, Users, Wallet, User, Mail, Landmark, IndianRupee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';

const navItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: Users, label: 'Refer', href: '/referrals' },
  { icon: Wallet, label: 'Wallet' },
  { icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [upiAddress, setUpiAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleNavClick = (item: (typeof navItems)[0]) => {
    if (item.href) {
      router.push(item.href);
    } else if (item.label === 'Wallet') {
      setIsWalletOpen(true);
    } else if (item.label === 'Profile') {
      setIsProfileOpen(true);
    }
  };

  const handleWithdraw = () => {
    if (parseFloat(amount) < 1) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Minimum withdrawal amount is ₹1.',
      });
      return;
    }
    toast({
      title: 'Withdrawal Initiated',
      description: `₹${amount} will be sent to ${upiAddress} shortly.`,
    });
    setIsWalletOpen(false);
    setAmount('');
    setUpiAddress('');
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

      {/* Wallet Dialog */}
      <AlertDialog open={isWalletOpen} onOpenChange={setIsWalletOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw Earnings</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your UPI address and the amount you wish to withdraw. Minimum
              withdrawal is ₹1.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="upi-address">UPI Address</Label>
              <div className="relative">
                <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="upi-address"
                  placeholder="your-name@upi"
                  value={upiAddress}
                  onChange={(e) => setUpiAddress(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (INR)</Label>
               <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="1.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                   className="pl-10"
                />
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleWithdraw}>
              Withdraw
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            <p className="text-sm font-medium">user@example.com</p>
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
