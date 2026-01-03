"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex h-full min-h-screen w-full flex-col bg-primary font-display text-background-dark">
      {/* Header with Logo */}
      <header className="flex items-center justify-center p-6 pt-12">
        <Link href="/" className="flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-4xl">restaurant</span>
          <span className="text-2xl font-bold">እንብላ</span>
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-12">
        <Card className="w-full max-w-md border-none bg-background-light shadow-2xl rounded-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-extrabold tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-background-dark/70 font-medium">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                className="h-12 rounded-full border-background-dark/10 bg-white px-4 focus-visible:ring-primary"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  href="#" 
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                className="h-12 rounded-full border-background-dark/10 bg-white px-4 focus-visible:ring-primary"
              />
            </div>
            <Button className="h-14 w-full rounded-full bg-primary text-lg font-bold text-white shadow-lg transition-transform active:scale-95 hover:bg-primary/90">
              Log In
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-background-dark/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background-light px-2 text-background-dark/50">Or continue with</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="h-14 w-full rounded-full border-2 border-[#0088cc] text-[#0088cc] hover:bg-[#0088cc] hover:text-white text-lg font-bold transition-all"
            >
              <svg className="mr-2 h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.88.03-.24.36-.48.99-.74 3.86-1.68 6.43-2.79 7.72-3.32 3.67-1.51 4.43-1.77 4.93-1.78.11 0 .35.03.5.16.13.11.17.26.18.37 0 .04.01.12 0 .2z"/>
              </svg>
              Log in with Telegram
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 text-center">
            <p className="text-sm font-medium text-background-dark/70">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-bold text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

