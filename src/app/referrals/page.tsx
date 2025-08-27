
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BottomNav from '@/components/bottom-nav';
import { Users, X } from 'lucide-react';
import Link from 'next/link';

export default function ReferralsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Referrals</h1>
        <Link href="/dashboard">
          <X className="h-6 w-6" />
        </Link>
      </header>
      <main className="flex-grow p-4 md:p-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Coming Soon!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Our referral program is currently under construction. Check back
              soon to earn rewards by inviting your friends!
            </p>
            <div className="flex flex-col items-center gap-4 text-center">
                <Users className="w-16 h-16 text-primary" />
                <h2 className="text-xl font-semibold">Get Ready to Share & Earn</h2>
                <p className="text-muted-foreground max-w-xs">
                    We are working hard to bring you an exciting referral system.
                </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
}
