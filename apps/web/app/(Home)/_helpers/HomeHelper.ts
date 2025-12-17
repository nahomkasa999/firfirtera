// Helper functions for formatting
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatPrice(price: number | "Free", expectedUsers: number): string {
  if (price === "Free") return "";
  const perPerson = Math.round(price / expectedUsers);
  return `$${perPerson}/person`;
}

export function getCuisine(mealName?: string): string {
  if (mealName?.toLowerCase().includes("ethiopian")) return "Ethiopian";
  if (mealName?.toLowerCase().includes("pizza")) return "Italian";
  if (mealName?.toLowerCase().includes("sushi")) return "Japanese";
  return "Cuisine";
}