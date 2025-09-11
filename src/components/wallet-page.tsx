
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import type { UserData } from '@/services/userData';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getUserData } from '@/services/userData';

export function WalletPage() {
  const [amount, setAmount] = useState('');
  const [paytmNumber, setPaytmNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [user, setUser] = useState<User | null>(null);

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
  const minBalanceInr = 1;
  const minBalanceReached = earningsInInr >= minBalanceInr;

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
                Withdraw your earnings via Paytm or UPI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="paytm">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="paytm">Paytm</TabsTrigger>
                  <TabsTrigger value="upi">UPI</TabsTrigger>
                </TabsList>
                <TabsContent value="paytm" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="paytm-number">Paytm Number</Label>
                    <Input
                      id="paytm-number"
                      placeholder="10-digit number"
                      value={paytmNumber}
                      onChange={(e) => setPaytmNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount-paytm">Amount (INR)</Label>
                    <div className="relative">
                      <Input
                        id="amount-paytm"
                        placeholder="e.g., 1"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-7"
                      />
                      <IndianRupee className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                      Min: ₹{minBalanceInr}
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="upi" className="space-y-4 pt-4">
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
                        placeholder="e.g., 1"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-7"
                      />
                      <IndianRupee className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                       Min: ₹{minBalanceInr}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
              <Button disabled={!minBalanceReached} className="w-full mt-4">
                {minBalanceReached
                  ? 'Withdraw'
                  : 'Minimum Balance Not Reached'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
