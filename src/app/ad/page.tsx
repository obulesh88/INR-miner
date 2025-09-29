
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AdPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.replace('/dashboard');
    }
  }, [countdown, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm text-center">
        <CardHeader>
          <CardTitle>Please wait</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">
              You are being redirected...
            </p>
            <p className="text-2xl font-bold">{countdown}</p>
            <p className="text-sm text-muted-foreground">
              You will be returned to the dashboard automatically.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
