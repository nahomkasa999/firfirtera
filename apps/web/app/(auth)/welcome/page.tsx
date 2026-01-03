"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <div className="flex h-full min-h-screen w-full flex-col overflow-hidden bg-primary font-display text-background-dark">
      <header className="flex items-center justify-center p-6 pt-12">
        <div className="flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-4xl">restaurant</span>
          <span className="text-2xl font-bold">እንብላ</span>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-8 aspect-square w-full max-w-xs">
          <div 
            className="absolute inset-0 h-full w-full rounded-full bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDA9reIfuIyWNhE5jLWrTS3htU32d2G0P9o_ediKbwWedHGdUcSBI-PERUZ4o0wbxHqn7jL6qNAdUsmVQ38CMCT4u7lSls6USM41D4gHxEOXqrxPVbZh0EJt9Noro1O70Vi34dxM9JZiDV4TuRb1aCD45sK_vcKXp-LJybfvoiV6D7ZZHEshmqvkTQ-YmhnumRO08H-VJGdt4QCXsmr-e0wl2I62plfKFZ654XwP8HRLyOTINWYKb5TO1ubun4Wb1GaIE0dpN-FcA")' 
            }}
          />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl">
          Never eat alone.
        </h1>
      </main>

      <footer className="p-6 pb-12">
        <div className="flex flex-col gap-4">
          <Button asChild className="h-16 w-full rounded-full bg-background-light px-6 text-lg font-bold text-background-dark shadow-lg transition-transform active:scale-95 hover:bg-background-light/90">
            <Link href="/signup">
              Find a Meal Nearby
            </Link>
          </Button>
          <Link 
            href="/login" 
            className="text-center text-sm font-medium text-black/70 hover:underline"
          >
            I already have an account
          </Link>
        </div>
      </footer>
    </div>
  );
}

