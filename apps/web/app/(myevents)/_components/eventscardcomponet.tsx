import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { upcomingEventCard } from "@/backendData/data-type";    import { formatMealTimeShort } from "@/lib/AppHelpers";

export function EventsMealCard({meals }: {meals: upcomingEventCard[]}) {
    return meals.map((meal) => (
        <Card key={meal.mealId}>
            <CardHeader>
                <CardTitle>{meal.mealname}</CardTitle>
                <CardDescription>{formatMealTimeShort(meal.mealtime)}</CardDescription>
                <CardContent>
                    <p>{meal.mealtype}</p>
                    <p>{meal.meallocation}</p>
                    <p>{meal.joinedusers.length} / {meal.expectedusers}</p>
                    <p>{meal.mealdescription}</p>
                </CardContent>
            </CardHeader>
        </Card>
    ))
}