import type { Metadata } from "next";
import "../globals.css";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "FirFirtera - Social Dining App",
  // description: "Perkly is a platform for creating and managing your organization's perks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      {children}
    </ReactQueryProvider>
  );
}