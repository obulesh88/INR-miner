
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Gift, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ReferralsPage() {
    const { toast } = useToast();
    const referralLink = "https://example.com/join?ref=USER123";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        toast({
            title: "Copied to clipboard!",
            description: "Your referral link has been copied.",
        });
    };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b">
         <Link href="/dashboard" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Referrals</h1>
        <div className='w-10'></div>
      </header>
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-md mx-auto space-y-6">
            <Card className="text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit">
                        <Gift className="h-8 w-8" />
                    </div>
                </CardHeader>
                <CardContent>
                    <CardTitle>Invite Friends, Earn Rewards</CardTitle>
                    <CardDescription className="mt-2">
                        Share your referral link with friends. When they sign up, you both get a bonus!
                    </CardDescription>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Your Referral Link</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="relative">
                        <Label htmlFor="referral-link" className="sr-only">Referral Link</Label>
                        <Input id="referral-link" value={referralLink} readOnly />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                            onClick={copyToClipboard}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                     </div>
                </CardContent>
            </Card>

        </div>
      </main>
    </div>
  );
}
