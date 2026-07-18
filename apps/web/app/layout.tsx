import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { CookieBanner } from "@/components/consent/CookieBanner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "Shred - Fitness Koçları İçin White-Label Platform",
  description:
    "Kendi markanızla profesyonel bir koçluk web sitesi oluşturun. Landing page, öğrenci yönetimi ve ödeme sistemi bir arada.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} ${oswald.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <Analytics />
        {children}
        <CookieBanner />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--dashboard-card-bg, #1a1a2e)",
              border: "1px solid var(--dashboard-card-border, #2a2a4a)",
              color: "var(--dashboard-main-text, #fff)",
            },
          }}
        />
      </body>
    </html>
  );
}
