import ParticipantProfileNavbar from "./_components/ParticipantProfileNavbar"
import ParticipantProfileHeader from "./_components/ParticipantProfileHeader"
import ProfileStats from "../_components/ProfileStats"
import ProfileInterests from "../_components/ProfileInterests"
import ProfileComments from "../_components/ProfileComments"
import { getParticipantProfile } from "@/backendData/queries"
import { notFound } from "next/navigation"

export default async function ParticipantProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const profile = getParticipantProfile(userId)

  if (!profile) {
    notFound()
  }

  return (
    <div className="relative min-h-screen w-full bg-background-light">
      <ParticipantProfileNavbar />
      <main className="flex flex-col gap-6 p-4 pb-28">
        <ParticipantProfileHeader profile={profile} />
        <ProfileStats stats={profile.stats} />
        <ProfileInterests interests={profile.interests} />
        <ProfileComments comments={[]} />
      </main>
    </div>
  )
}




