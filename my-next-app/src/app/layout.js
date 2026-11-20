
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers.js";
import { Toaster } from "sonner";
import AppShell from "./AppShell.js";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Company System",
  description: "Company management system",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <Providers>
          <AppShell>
            {children}
          </AppShell>

          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
