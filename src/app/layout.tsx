
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
        <title>INR Miner – Earn Real INR by Mining Simulator</title>
        <meta
          name="description"
          content="INR Miner lets you earn INR by simulating crypto mining. Boost hash power, earn coins, and withdraw rewards securely!"
        />
        <meta
          name="keywords"
          content="INR Miner, mining app, crypto miner, earn money, bitcoin simulator, mining rewards"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.inrminer.com" />
        <link rel="manifest" href="/manifest.json" />

        {/* Open Graph */}
        <meta property="og:title" content="INR Miner – Earn Real INR by Mining Simulator" />
        <meta
          property="og:description"
          content="Simulate mining, earn coins, and withdraw INR easily. The most fun way to mine rewards online!"
        />
        <meta property="og:image" content="https://www.inrminer.com/banner.png" />
        <meta property="og:url" content="https://www.inrminer.com" />
        <meta property="og:type" content="website" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://www.inrminer.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#1976d2" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MobileApplication",
              name: "INR Miner",
              url: "https://www.inrminer.com",
              operatingSystem: "WEB",
              applicationCategory: "FinanceApplication",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
            }),
          }}
        />
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
