
'use client';
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { useEffect } from 'react';
import { UserDataProvider } from '@/contexts/user-data-context';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
  }, []);
  
  return (
    <html lang="en" className="dark">
      <head>
        <title>Crypto Monitor</title>
        <meta name="description" content="Track crypto values and get AI-powered insights." />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#1976d2" />
      </head>
      <body className="font-body antialiased pb-20 md:pb-0">
        <UserDataProvider>
          {children}
          <FirebaseErrorListener />
        </UserDataProvider>
        <Toaster />
      </body>
    </html>
  );
}
