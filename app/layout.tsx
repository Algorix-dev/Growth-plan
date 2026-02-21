import type { Metadata } from "next";
import { Bebas_Neue, JetBrains_Mono, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const crimson = Crimson_Pro({
  style: ["italic"],
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-serif",
});

import Script from "next/script";

export const viewport = {
  themeColor: "#0E0E0E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "EP · OS | Personal Development OS",
  description: "Emmanuel Peter's Personal Operating System for the Forging Phase.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EP · OS",
  },
  icons: {
    icon: "/api/icon?size=192",
    apple: "/api/icon?size=192",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${bebas.variable} ${jetbrains.variable} ${crimson.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster position="bottom-right" theme="dark" closeButton />
          <Script src="/sw-register.js" strategy="afterInteractive" />
        </ThemeProvider>
      </body>
    </html>
  );
}
