
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import type { UserData } from '@/services/userData';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getUserData } from '@/services/userData';
import { useToast } from '@/hooks/use-toast';

export function WalletPage() {
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load from localStorage first
        const localDataStr = localStorage.getItem(`userData-${currentUser.uid}`);
        if (localDataStr) {
          setUserData(JSON.parse(localDataStr));
        }
        // Then get from firebase for latest
        const firebaseData = await getUserData(currentUser.uid);
        if (firebaseData) {
          setUserData(firebaseData);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const earningsInInr = userData?.earnings || 0.0;
  const minWithdrawalInr = 5;
  const maxWithdrawalInr = 8;
  const amountNum = parseFloat(amount);

  const canWithdraw =
    !isNaN(amountNum) &&
    amountNum >= minWithdrawalInr &&
    amountNum <= maxWithdrawalInr &&
    earningsInInr >= amountNum &&
    upiId.trim() !== '';
    
  let buttonText = 'Withdraw';
  if (isNaN(amountNum) || amountNum <= 0) {
      buttonText = 'Enter an amount';
  } else if (earningsInInr < minWithdrawalInr) {
      buttonText = `Minimum balance of ₹${minWithdrawalInr} required`;
  } else if (amountNum < minWithdrawalInr) {
      buttonText = `Minimum withdrawal is ₹${minWithdrawalInr}`;
  } else if (amountNum > maxWithdrawalInr) {
      buttonText = `Maximum withdrawal is ₹${maxWithdrawalInr}`;
  } else if (amountNum > earningsInInr) {
      buttonText = 'Insufficient balance';
  } else if (upiId.trim() === '') {
    buttonText = 'Enter UPI ID';
  }


  const handleWithdraw = () => {
    // This is a placeholder for the actual withdrawal logic.
    // In a real application, you would call a server-side function
    // to process the withdrawal securely.
    toast({
      title: 'Withdrawal Request Submitted',
      description: `Your request to withdraw ₹${amount} has been received. Please allow 24-48 hours for processing.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Wallet</h1>
        <Link href="/dashboard">
          <X className="h-6 w-6" />
        </Link>
      </header>
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-md mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-normal text-muted-foreground">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-8 w-8" />
                <div>
                  <p className="text-2xl font-bold">
                    ₹{(earningsInInr || 0).toFixed(5)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Indian Rupees
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Withdraw Earnings</CardTitle>
              <CardDescription>
                Withdraw your earnings via UPI.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="upi-id">UPI ID</Label>
                    <Input
                      id="upi-id"
                      placeholder="yourname@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount-upi">Amount (INR)</Label>
                    <div className="relative">
                      <Input
                        id="amount-upi"
                        placeholder={`e.g., ${minWithdrawalInr}`}
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-7"
                      />
                      <IndianRupee className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                       Min: ₹{minWithdrawalInr} | Max: ₹{maxWithdrawalInr}
                    </p>
                  </div>
                </div>
              <Button onClick={handleWithdraw} disabled={!canWithdraw} className="w-full mt-4">
                {buttonText}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
