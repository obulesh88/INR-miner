import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Earning App",
  description: "Watch ads and earn crypto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${inter.variable} font-body bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
          <FirebaseErrorListener />
        </AuthProvider>
      </body>
    </html>
  );
}
