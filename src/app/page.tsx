
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="text-center py-12 px-4">
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start mining and earn with our fun, secure, and easy mining simulator.
        </p>

        <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-card-foreground">Features</h3>
            <ul className="space-y-3 text-left">
                <li className="flex items-center gap-3">
                    <span className="text-primary">⚙️</span>
                    <span>Simulated crypto mining</span>
                </li>
                <li className="flex items-center gap-3">
                    <span className="text-primary">💸</span>
                    <span>Earn coins convertible to real rewards</span>
                </li>
                 <li className="flex items-center gap-3">
                    <span className="text-primary">🚀</span>
                    <span>Boost hash power by watching ads</span>
                </li>
                 <li className="flex items-center gap-3">
                    <span className="text-primary">🔒</span>
                    <span>Secure wallet with instant withdrawals</span>
                </li>
            </ul>
        </div>
        
        <div className="space-y-4">
            <Button asChild size="lg">
                <Link href="/dashboard">
                    Go to App
                </Link>
            </Button>
        </div>
      </main>
    </div>
  );
}
