"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Gift, Wallet, UtensilsCrossed, MapPin, Clock, Users, UserCog, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import type { createMealData } from "@/backendData/data-type"
import FieldHelp from "./FieldHelp"

type FormData = Partial<createMealData> & {
  mealtype: "Split" | "Companion"
  mealgenderpreference: "Anonymous" | "Specific"
}

export default function CreateMealForm() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      mealtype: "Split",
      mealgenderpreference: "Anonymous",
    },
  })

  const mealType = watch("mealtype")
  const genderPreference = watch("mealgenderpreference")

  const onSubmit = (data: FormData) => {
    // TODO: Handle form submission
    console.log("Form submitted:", data)
  }

  // Validate time is in the future
  const validateFutureDate = (value: Date | null | undefined) => {
    if (!value) return "Time is required"
    const now = new Date()
    if (value <= now) {
      return "Time must be in the future"
    }
    return true
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 pb-32">
      {/* Mode Selection */}
      <div className="flex flex-col gap-3">
        <label className="text-base font-semibold text-foreground">Mode</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setValue("mealtype", "Split")
              setValue("contributionAmount", undefined)
            }}
            className={cn(
              "flex h-auto min-h-24 flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-colors",
              mealType === "Split"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            <Gift className="h-8 w-8" />
            <span className="text-sm font-semibold">Split (Treat Group)</span>
            <span className="text-xs text-center text-muted-foreground">
              Order food together and split the total bill equally among all participants.
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setValue("mealtype", "Companion")
              setValue("mealname", undefined)
              setValue("totalMealPrice", undefined)
            }}
            className={cn(
              "flex h-auto min-h-24 flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-colors",
              mealType === "Companion"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            <Wallet className="h-8 w-8" />
            <span className="text-sm font-semibold">Companionship</span>
            <span className="text-xs text-center text-muted-foreground">
              Find dining companions where each person contributes a fixed amount to share a meal together.
            </span>
          </button>
        </div>
      </div>

      {/* Split Form */}
      {mealType === "Split" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="food-name" className="text-base font-semibold text-foreground">
                Food Name
              </label>
              <FieldHelp helpText="Enter the name of the food or meal. Maximum 30 characters." />
            </div>
            <div className="relative">
              <UtensilsCrossed className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="food-name"
                type="text"
                placeholder="e.g., Pizza Night"
                className="h-12 pl-10 border-[0.5px] shadow-none focus-visible:ring-1 focus-visible:ring-offset-0"
                maxLength={30}
                {...register("mealname", { 
                  required: "Food name is required",
                  maxLength: { value: 30, message: "Food name must be 30 characters or less" }
                })}
              />
              {errors.mealname && (
                <p className="mt-1 text-sm text-destructive">{errors.mealname.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="location" className="text-base font-semibold text-foreground">
                Location
              </label>
              <FieldHelp helpText="Enter the restaurant name or full address where the meal will take place. Minimum 5 characters, maximum 200 characters." />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location"
                type="text"
                placeholder="Enter restaurant or address"
                className="h-12 pl-10 border-[0.5px] shadow-none focus-visible:ring-1 focus-visible:ring-offset-0"
                {...register("meallocation", { 
                  required: "Location is required",
                  minLength: { value: 5, message: "Location must be at least 5 characters" },
                  maxLength: { value: 200, message: "Location must be 200 characters or less" }
                })}
              />
              {errors.meallocation && (
                <p className="mt-1 text-sm text-destructive">{errors.meallocation.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="time-split" className="text-base font-semibold text-foreground">
                Time
              </label>
              <FieldHelp helpText="Select the date and time for the meal. Must be in the future." />
            </div>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground z-10" />
              <Input
                id="time-split"
                type="datetime-local"
                className="h-12 pl-10 border-[0.5px] shadow-none focus-visible:ring-1 focus-visible:ring-offset-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5"
                {...register("mealtime", { 
                  required: "Time is required",
                  valueAsDate: true,
                  validate: validateFutureDate
                })}
              />
              {!watch("mealtime") && (
                <span className="absolute left-10 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-sm">
                  Select date and time
                </span>
              )}
              {!watch("mealtime") && (
                <span className="absolute left-10 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-sm">
                  Select date and time
                </span>
              )}
              {errors.mealtime && (
                <p className="mt-1 text-sm text-destructive">{errors.mealtime.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="people-joining" className="text-base font-semibold text-foreground">
                Number of people joining
              </label>
              <FieldHelp helpText="Enter the number of people you want to join (excluding yourself). Minimum 1, maximum 8 people." />
            </div>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="people-joining"
                type="number"
                placeholder="e.g., 4"
                className="h-12 pl-10 border-[0.5px] shadow-none focus-visible:ring-1 focus-visible:ring-offset-0"
                min="1"
                max="8"
                {...register("expectedusers", { 
                  required: "Number of people is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Must be at least 1" },
                  max: { value: 8, message: "Maximum 8 people allowed" }
                })}
              />
              {errors.expectedusers && (
                <p className="mt-1 text-sm text-destructive">{errors.expectedusers.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="total-price" className="text-base font-semibold text-foreground">
                Total Meal Price (Birr)
              </label>
              <FieldHelp helpText="Enter the total cost of the meal. Can be 0 for free meals. Maximum 10,000 Birr. The cost will be split equally among all participants." />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                Br
              </span>
              <Input
                id="total-price"
                type="number"
                placeholder="e.g., 2000"
                className="h-12 pl-10 border-[0.5px] shadow-none focus-visible:ring-1 focus-visible:ring-offset-0"
                min="0"
                max="10000"
                step="0.01"
                {...register("totalMealPrice", { 
                  required: "Total meal price is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Must be 0 or greater" },
                  max: { value: 10000, message: "Maximum 10,000 Birr allowed" }
                })}
              />
              {errors.totalMealPrice && (
                <p className="mt-1 text-sm text-destructive">{errors.totalMealPrice.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-base font-semibold text-foreground">
                Gender Preference (Optional)
              </label>
              <FieldHelp helpText="Choose whether you have a gender preference for participants. If 'Specific' is selected, you'll need to specify the number of males." />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setValue("mealgenderpreference", "Anonymous")}
                className={cn(
                  "flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border-2 transition-colors",
                  genderPreference === "Anonymous"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground"
                )}
              >
                <UserCog className="h-5 w-5" />
                <span className="text-sm font-semibold">No Preference</span>
              </button>
              <button
                type="button"
                onClick={() => setValue("mealgenderpreference", "Specific")}
                className={cn(
                  "flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border-2 transition-colors",
                  genderPreference === "Specific"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground"
                )}
              >
                <UserCog className="h-5 w-5" />
                <span className="text-sm font-semibold">Specific</span>
              </button>
            </div>
            <input type="hidden" {...register("mealgenderpreference")} />
          </div>

          {genderPreference === "Specific" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <label htmlFor="number-of-males" className="text-base font-semibold text-foreground">
                  Number of Males
                </label>
                <FieldHelp helpText="Enter the number of male participants you want. Must be between 0 and the total number of people joining." />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="number-of-males"
                  type="number"
                  placeholder="e.g., 2"
                  className="h-12 pl-10 border-[0.5px] shadow-none focus-visible:ring-1 focus-visible:ring-offset-0"
                  min="0"
                  {...register("numberofmales", { 
                    required: genderPreference === "Specific" ? "Number of males is required" : false,
                    valueAsNumber: true,
                    min: { value: 0, message: "Must be 0 or greater" },
                    validate: (value) => {
                      if (value === undefined || value === null) return true
                      const expectedUsers = watch("expectedusers")
                      if (expectedUsers && typeof value === "number" && value > expectedUsers) {
                        return "Cannot exceed number of people joining"
                      }
                      return true
                    }
                  })}
                />
                {errors.numberofmales && (
                  <p className="mt-1 text-sm text-destructive">{errors.numberofmales.message}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="description" className="text-base font-semibold text-foreground">
                Description (Optional)
              </label>
              <FieldHelp helpText="Add any additional details about the meal event. Maximum 500 characters." />
            </div>
            <div className="relative">
              <FileText className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
              <Textarea
                id="description"
                placeholder="Add a short note about the event"
                className="min-h-[100px] pl-10 pt-3 border-[0.5px] shadow-none focus-visible:ring-1 focus-visible:ring-offset-0"
                rows={4}
                maxLength={500}
                {...register("mealdescription", {
                  maxLength: { value: 500, message: "Description must be 500 characters or less" }
                })}
              />
              {errors.mealdescription && (
                <p className="mt-1 text-sm text-destructive">{errors.mealdescription.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Companionship Form */}
      {mealType === "Companion" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="contribution" className="text-base font-semibold text-foreground">
                Birr each contributing
              </label>
              <FieldHelp helpText="Enter the amount each person will contribute. Can be 0 for free. Maximum 2,000 Birr per person." />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                Br
              </span>
              <Input
                id="contribution"
                type="number"
                placeholder="e.g., 500"
                className="h-12 pl-10 border-[0.5px] shadow-none focus-visible:ring-1 focus-visible:ring-offset-0"
                min="0"
                max="2000"
                step="0.01"
                {...register("contributionAmount", { 
                  required: "Contribution amount is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Must be 0 or greater" },
                  max: { value: 2000, message: "Maximum 2,000 Birr per person allowed" }
                })}
              />
              {errors.contributionAmount && (
                <p className="mt-1 text-sm text-destructive">{errors.contributionAmount.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="people-looking" className="text-base font-semibold text-foreground">
                Number of people looking
              </label>
              <FieldHelp helpText="Enter the number of people you're looking for to join. Minimum 1, maximum 8 people." />
            </div>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="people-looking"
                type="number"
                placeholder="e.g., 3"
                className="h-12 pl-10 border-[0.5px] shadow-none focus-visible:ring-1 focus-visible:ring-offset-0"
                min="1"
                max="8"
                {...register("expectedusers", { 
                  required: "Number of people is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Must be at least 1" },
                  max: { value: 8, message: "Maximum 8 people allowed" }
                })}
              />
              {errors.expectedusers && (
                <p className="mt-1 text-sm text-destructive">{errors.expectedusers.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="location-companion" className="text-base font-semibold text-foreground">
                Location
              </label>
              <FieldHelp helpText="Enter the restaurant name or full address where the meal will take place. Minimum 5 characters, maximum 200 characters." />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location-companion"
                type="text"
                placeholder="Enter restaurant or address"
                className="h-12 pl-10 border-[0.5px] shadow-none focus-visible:ring-1 focus-visible:ring-offset-0"
                {...register("meallocation", { 
                  required: "Location is required",
                  minLength: { value: 5, message: "Location must be at least 5 characters" },
                  maxLength: { value: 200, message: "Location must be 200 characters or less" }
                })}
              />
              {errors.meallocation && (
                <p className="mt-1 text-sm text-destructive">{errors.meallocation.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="time-companionship" className="text-base font-semibold text-foreground">
                Time
              </label>
              <FieldHelp helpText="Select the date and time for the meal. Must be in the future." />
            </div>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground z-10" />
              <Input
                id="time-companionship"
                type="datetime-local"
                className="h-12 pl-10 border-[0.5px] shadow-none focus-visible:ring-1 focus-visible:ring-offset-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5"
                {...register("mealtime", { 
                  required: "Time is required",
                  valueAsDate: true,
                  validate: validateFutureDate
                })}
              />
              {!watch("mealtime") && (
                <span className="absolute left-10 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-sm">
                  Select date and time
                </span>
              )}
              {errors.mealtime && (
                <p className="mt-1 text-sm text-destructive">{errors.mealtime.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-base font-semibold text-foreground">
                Gender Preference (Optional)
              </label>
              <FieldHelp helpText="Choose whether you have a gender preference for participants. If 'Specific' is selected, you'll need to specify the number of males." />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setValue("mealgenderpreference", "Anonymous")}
                className={cn(
                  "flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border-2 transition-colors",
                  genderPreference === "Anonymous"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground"
                )}
              >
                <UserCog className="h-5 w-5" />
                <span className="text-sm font-semibold">No Preference</span>
              </button>
              <button
                type="button"
                onClick={() => setValue("mealgenderpreference", "Specific")}
                className={cn(
                  "flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border-2 transition-colors",
                  genderPreference === "Specific"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground"
                )}
              >
                <UserCog className="h-5 w-5" />
                <span className="text-sm font-semibold">Specific</span>
              </button>
            </div>
            <input type="hidden" {...register("mealgenderpreference")} />
          </div>

          {genderPreference === "Specific" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <label htmlFor="number-of-males-companion" className="text-base font-semibold text-foreground">
                  Number of Males
                </label>
                <FieldHelp helpText="Enter the number of male participants you want. Must be between 0 and the total number of people looking." />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="number-of-males-companion"
                  type="number"
                  placeholder="e.g., 2"
                  className="h-12 pl-10 border-[0.5px] shadow-none focus-visible:ring-1 focus-visible:ring-offset-0"
                  min="0"
                  {...register("numberofmales", { 
                    required: genderPreference === "Specific" ? "Number of males is required" : false,
                    valueAsNumber: true,
                    min: { value: 0, message: "Must be 0 or greater" },
                    validate: (value) => {
                      if (value === undefined || value === null) return true
                      const expectedUsers = watch("expectedusers")
                      if (expectedUsers && typeof value === "number" && value > expectedUsers) {
                        return "Cannot exceed number of people looking"
                      }
                      return true
                    }
                  })}
                />
                {errors.numberofmales && (
                  <p className="mt-1 text-sm text-destructive">{errors.numberofmales.message}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="description-companion" className="text-base font-semibold text-foreground">
                Description (Optional)
              </label>
              <FieldHelp helpText="Add any additional details about the meal event. Maximum 500 characters." />
            </div>
            <div className="relative">
              <FileText className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
              <Textarea
                id="description-companion"
                placeholder="Add a short note about the event"
                className="min-h-[100px] pl-10 pt-3 border-[0.5px] shadow-none focus-visible:ring-1 focus-visible:ring-offset-0"
                rows={4}
                maxLength={500}
                {...register("mealdescription", {
                  maxLength: { value: 500, message: "Description must be 500 characters or less" }
                })}
              />
              {errors.mealdescription && (
                <p className="mt-1 text-sm text-destructive">{errors.mealdescription.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submit Button - Fixed positioning above bottom nav */}
      <div className="fixed bottom-16 left-0 right-0 z-50 p-4 bg-background-light/95 backdrop-blur-sm border-t border-border md:bottom-16 md:left-auto md:right-auto md:w-[50%]">
        <Button
          type="submit"
          className="h-12 w-full text-base font-bold shadow-sm"
        >
          Create Meal
        </Button>
      </div>
    </form>
  )
}
