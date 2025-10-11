
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, IndianRupee, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useUserData } from '@/contexts/user-data-context';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { format } from 'date-fns';

export function WalletPage() {
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const { userData, isLoading, updateUserData } = useUserData();
  const { toast } = useToast();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const earningsInInr = userData?.earnings || 0.0;
  const minWithdrawalInr = 1;
  const maxWithdrawalInr = 10;
  const amountNum = parseFloat(amount);

  const canWithdraw =
    !isNaN(amountNum) &&
    amountNum >= minWithdrawalInr &&
    amountNum <= maxWithdrawalInr &&
    earningsInInr >= amountNum &&
    upiId.trim() !== '';
    
  let buttonText = 'Withdraw';
  if (isWithdrawing) {
    buttonText = 'Processing...';
  } else if (isNaN(amountNum) || amountNum <= 0) {
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


  const handleWithdraw = async () => {
    if (!canWithdraw) return;

    setIsWithdrawing(true);
    try {
      const newEarnings = earningsInInr - amountNum;
      const newWithdrawalRequest = {
          amount: amountNum,
          upiId: upiId,
          date: 'server-timestamp', // This is a placeholder for the backend
          status: 'Pending' as const
      };

      await updateUserData({
          earnings: newEarnings,
          withdrawals: [newWithdrawalRequest],
      });
      
      toast({
        title: 'Withdrawal Request Submitted',
        description: `Your request to withdraw ₹${amountNum.toFixed(2)} has been received.`,
      });

      setAmount('');
      setUpiId('');
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Withdrawal Failed',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsWithdrawing(false);
    }
  };
  
  const withdrawals = userData?.withdrawals || [];

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
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8" />
                  <div>
                     <Skeleton className="h-7 w-32 mb-2" />
                     <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-8 w-8" />
                  <div>
                    <p className="text-2xl font-bold">
                      ₹{earningsInInr.toFixed(5)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Indian Rupees
                    </p>
                  </div>
                </div>
              )}
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
                      disabled={isLoading || isWithdrawing}
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
                        disabled={isLoading || isWithdrawing}
                      />
                      <IndianRupee className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                       Min: ₹{minWithdrawalInr} | Max: ₹{maxWithdrawalInr}
                    </p>
                  </div>
                </div>
              <Button onClick={handleWithdraw} disabled={!canWithdraw || isLoading || isWithdrawing} className="w-full mt-4">
                {isWithdrawing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {buttonText}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
              <CardDescription>
                Your recent withdrawal transactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
               {isLoading && withdrawals.length === 0 ? (
                <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
               ) : withdrawals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals.map((w, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {w.date instanceof Date ? format(w.date, "MMM d, yyyy") : 'Processing...'}
                        </TableCell>
                        <TableCell>₹{w.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={w.status === 'Pending' ? 'secondary' : 'default'}>{w.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
               ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  You have no withdrawal history yet.
                </p>
               )}
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
