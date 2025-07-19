import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ApiStatusProvider } from "@/lib/api-status-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Basketball Analytics | Illinois Men's Basketball",
  description: "Advanced basketball analytics, March Madness predictions, team analysis, and tournament insights for Illinois Men's Basketball",
  keywords: ["basketball", "analytics", "March Madness", "Illinois", "tournament", "predictions"],
  authors: [{ name: "Basketball Analytics Team" }],
  icons: {
    icon: [
      { url: "/basketball-favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" }
    ],
    apple: [
      { url: "/basketball-favicon.svg", type: "image/svg+xml" }
    ]
  },
  openGraph: {
    title: "Basketball Analytics | Illinois Men's Basketball",
    description: "Advanced basketball analytics and March Madness predictions",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="icon" href="/basketball-favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 light`}
        style={{ colorScheme: 'light' }}
      >
        <ApiStatusProvider>
          <Navigation />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </ApiStatusProvider>
      </body>
    </html>
  );
}
