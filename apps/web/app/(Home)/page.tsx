import HomeMain from "./_components/HomeMain";
import HomeTopNavBar from "./_components/HomeTopNavBar";
import { getDashboardData } from "@/backendData/queries";

export default function Page() {
  const dashboardData = getDashboardData();

  return (
    <>
      <HomeTopNavBar />
      <HomeMain 
        nearYou={dashboardData.nearYou}
        almostFilled={dashboardData.almostFilled}
        recent={dashboardData.recent}
      />
    </>
  );
}