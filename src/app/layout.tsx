import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { SupabaseProvider } from "@/contexts/SupabaseContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Библиотека Личных Процедур",
  description: "Платформа для создания, хранения и выполнения персональных чек-листов и многошаговых процедур",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SupabaseProvider>
          <Navbar />
          <main className="container mx-auto py-6">
            {children}
          </main>
          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
              <p className="text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Библиотека Личных Процедур. Все права защищены.
              </p>
            </div>
          </footer>
        </SupabaseProvider>
      </body>
    </html>
  );
}