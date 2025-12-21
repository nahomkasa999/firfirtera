import MealDetail from "./_components/MealDetail";
import { getMealById } from "@/backendData/queries";
import MealDetailNavbar from "./_components/MealDetailNavbar";
import type { mealDetailData } from "@/backendData/data-type";
import { notFound } from "next/navigation";

export default async function MealDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meal = getMealById(id) as mealDetailData;

  if (!meal) {
    notFound();
  }

  return (
    <>
      <MealDetailNavbar />
      <MealDetail />
    </>
  );
}