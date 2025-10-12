import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function AdPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b">
        <Link href="/dashboard" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Watch Ad</h1>
        <div className="w-10"></div>
      </header>
      <main className="flex-grow p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Advertisement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Ad content would be displayed here.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
