
'use client';

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
        <title>Crypto Mining App</title>
        <meta
          name="description"
          content="Start mining and earn with our fun, secure, and easy mining simulator."
        />
        <meta
          name="keywords"
          content="mining app, crypto miner, earn money, bitcoin simulator, mining rewards"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.inrminer.com" />
        <link rel="manifest" href="/manifest.json" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://www.inrminer.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
