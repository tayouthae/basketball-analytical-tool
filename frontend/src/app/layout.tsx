import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

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
  description: "Advanced basketball analytics, Tournament Analysis predictions, team analysis, and tournament insights for Illinois Men's Basketball",
  keywords: ["basketball", "analytics", "Tournament Analysis", "Illinois", "tournament", "predictions"],
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
    description: "Advanced basketball analytics and Tournament Analysis predictions",
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
        <Navigation />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
