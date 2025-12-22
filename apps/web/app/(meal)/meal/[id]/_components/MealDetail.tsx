"use client"

import { Users, Clock, MapPin, CreditCard, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { mealDetailData } from "@/backendData/data-type"
import { useParams } from "next/navigation"
import { getMealById } from "@/backendData/queries"
import MealDetailFooter from "./MealDetailFooter"

export default function MealDetail() {

    const mealId = useParams().id;
    const meal = getMealById(mealId as string) as mealDetailData;

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light">
      <main className="flex-grow pb-28 mb-10">
        {/* Hero Image */}
        {meal.mealpicture && meal.mealpicture.trim() !== "" ? (
          <div className="px-4">
            <div
              className="min-h-60 w-full overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat sm:min-h-80"
              style={{
                backgroundImage: `url("${ "https://lh3.googleusercontent.com/aida-public/AB6AXuCVgocUIoV6uAWCmb6q-NHUVYnCJyhyAZSmlpzUUAXbZxoVcjUitlOB6zp6yMWThcNeOCYXzDqgupUNGtt2Yyk_cx3A-z35pUa03habIMnALEVcjAZE6HJRKMwOlqtJiAIe63iBkZ_uj1ygwJwX4lt-52NARqfDxSEvIgeYTA9GFmWwaEE2MBzhmAzYumwarNVGOY4ITrEMwh79-9EEA7ZIJofQp_78dGZm2ACwE2E-7GUsjw8DIM2t33KrISISjQaa0bAiNoaB1A" }")`,
              }}
              aria-label={`Image of ${meal.mealname || "meal"}`}
            />
          </div>
        ) : null}

        {/* Title Section */}
        <div className="px-4 pb-3 pt-6">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground">
            {meal.mealname}
          </h1>
          <p className="mt-1 text-base text-muted-foreground">{meal.mealtype}</p>
        </div>

        {/* Info Cards */}
        <div className="px-4 pt-2">
          <Card className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <CardContent className="grid grid-cols-2 gap-y-4 p-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/20">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="font-bold text-foreground">{meal.joinedusers.length}/{meal.expectedusers} Joined</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/20">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time</p>
                  <p className="font-bold text-foreground">{meal.formattedTime}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/20">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="font-bold text-foreground">{meal.meallocation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <hr className="mx-4 my-6 border-border/60" />

        {/* Payment Section */}
        <div className="px-4">
          <h3 className="mb-4 text-xl font-bold text-foreground">Payment</h3>
          <Card className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <CardContent className="p-0">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/20">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Each person pays
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {meal.paymentDetails.perPerson === "Free"
                      ? "Free"
                      : `${meal.paymentDetails.perPerson} Birr`}
                  </p>
                </div>
              </div>
              <hr className="my-3 border-border/60" />
              <div className="space-y-1 text-sm text-muted-foreground">
                {meal.paymentDetails.totalAmount && (
                  <p>
                    <span className="font-semibold">Total money:</span>{" "}
                    {meal.paymentDetails.totalAmount} Birr ({meal.expectedusers} people)
                  </p>
                )}
                <p>{meal.paymentDetails.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <hr className="mx-4 my-6 border-border/60" />

        {/* About Section */}
        {meal.mealdescription && (
          <>
            <div className="px-4">
              <h3 className="mb-3 text-xl font-bold text-foreground">About this meal</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                {meal.mealdescription}
              </p>
            </div>
            <hr className="mx-4 my-6 border-border/60" />
          </>
        )}

        {/* Host Section */}
        <div className="px-4">
          <h3 className="mb-4 text-xl font-bold text-foreground">The Host</h3>
          <div className="flex items-center justify-between gap-4 bg-background-light">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage
                  src={meal.MealHost.profilePicture}
                  alt={`Profile picture of ${meal.MealHost.name}`}
                />
                <AvatarFallback>
                  {meal.MealHost.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center">
                <p className="text-base font-semibold leading-normal text-foreground">
                  {meal.MealHost.name}
                </p>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Star className="h-4 w-4 fill-current" />
                  <p className="text-sm font-normal leading-normal">{meal.MealHost.badge || "New Host"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MealDetailFooter meal={meal} />
    </div>
  )
}

