import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import BottomNav from "@/components/bottom-nav";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export const metadata: Metadata = {
  title: "FirFirtera - Social Dining App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} font-display antialiased lg:w-[50%] mx-auto`}>
        <div >
          {children}
        </div>
        <Toaster />
        <BottomNav />
      </body>
    </html>
  );
}