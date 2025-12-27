import HostMealRequestsNavbar from "./_components/HostMealRequestsNavbar"
import MealHeaderCard from "./_components/MealHeaderCard"
import RequestListWrapper from "./_components/RequestListWrapper"
import { getHostMealRequests } from "@/backendData/queries"
import { notFound } from "next/navigation"

export default async function HostMealRequestsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const meal = getHostMealRequests(id)

  if (!meal) {
    notFound()
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light">
      <HostMealRequestsNavbar />
      <main className="flex flex-col flex-1 px-4 pb-28">
        <MealHeaderCard meal={meal} />
        <h3 className="tracking-light text-2xl font-bold leading-tight text-left pb-2 pt-8">
          {meal.pendingRequestsCount} Pending Requests
        </h3>
        <RequestListWrapper meal={meal} />
      </main>
    </div>
  )
}

