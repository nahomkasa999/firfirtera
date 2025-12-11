"use client";

import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export function HomePage() {
  return (
    <div className="flex h-full min-h-screen w-[30%] flex-col overflow-hidden bg-[#f47b25] text-[#221710]">
      <header className="flex items-center justify-center p-6 pt-12">
        <div className="flex items-center justify-center gap-2">
          <UtensilsCrossed className="h-9 w-9" />
          <span className="text-2xl font-bold">MealUp</span>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-8 aspect-square w-full max-w-xs">
          <div
            className="absolute inset-0 h-full w-full rounded-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCsymQk9rjt10nV1L1MmrcrEA5VbgSyiMwqggFt5nQzvBiTbyA9oYvCzX3Qr_jpW8XtvVuvLAo40JyOf2yIVTKGVSiEQHAdg6ROZh1JoLkNvIiNusgEGvQB8XH9YkFG82rx5e15p-xhmOxTbDL09Zm-USuxIr5HIGJZZxacuiQLbjgBlQ0Nf54KplAXLL8zOu0UZ1nc6Blpt9UfCE8MalBUCG_gMqIQGa7KuBQ9RmUHW7faUrRzYbVFTzqK5fpprC3KHetfCOFOIQ")',
            }}
            aria-label="A birds-eye view of a delicious meal with grilled chicken and vegetables on a wooden table."
          />
        </div>

        <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl">
          Never eat alone.
        </h1>
      </main>

      <footer className="p-6 pb-12">
        <div className="flex flex-col gap-4">
          <button className="flex h-16 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#f8f7f5] px-6 text-lg font-bold text-[#221710] shadow-lg transition-transform active:scale-95">
            <span className="truncate">Find a Meal Nearby</span>
          </button>
          <Link
            href="#"
            className="text-center text-sm font-medium text-black/70"
          >
            I already have an account
          </Link>
        </div>
      </footer>
    </div>
  );
}
