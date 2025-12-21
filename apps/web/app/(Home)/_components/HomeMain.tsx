"use client";

import MealCard from "@/components/MealCard";
import type { dashboardMealCard } from "@/backendData/data-type";

interface HomeMainProps {
  nearYou: dashboardMealCard[];
  almostFilled: dashboardMealCard[];
  recent: dashboardMealCard[];
}

export default function HomeMain({ nearYou, almostFilled, recent }: HomeMainProps) {
  return (
    <main className="flex flex-col gap-8 pb-28">
      
      {/* 1. Near You - Horizontal Scroll */}
      {nearYou.length > 0 && (
        <section>
          <div className="px-4 mb-3 flex justify-between items-end">
            <h2 className="text-lg font-bold text-foreground">Near You</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">
            {nearYou.map((meal) => (
              <MealCard key={meal.mealId} meal={meal} layout="horizontal" />
            ))}
          </div>
        </section>
      )}

      {/* 2. Almost Full - Horizontal Scroll */}
      {almostFilled.length > 0 && (
        <section>
          <div className="px-4 mb-3 flex justify-between items-end">
            <h2 className="text-lg font-bold text-foreground">Almost Full</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">
            {almostFilled.map((meal) => (
              <MealCard key={meal.mealId} meal={meal} layout="horizontal" />
            ))}
          </div>
        </section>
      )}

      {/* 3. All - Vertical List */}
      <section className="px-4">
        <div className="mb-3">
          <h2 className="text-lg font-bold text-foreground">All</h2>
        </div>
        <div className="flex flex-col gap-3">
          {recent.map((meal) => (
            <MealCard key={meal.mealId} meal={meal} layout="vertical" />
          ))}
        </div>
      </section>

    </main>
  );
}