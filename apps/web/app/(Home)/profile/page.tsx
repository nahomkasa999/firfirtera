import ProfileNavbar from "./_components/ProfileNavbar"
import ProfileHeader from "./_components/ProfileHeader"
import ProfileStats from "./_components/ProfileStats"
import ProfileInterests from "./_components/ProfileInterests"
import ProfileComments from "./_components/ProfileComments"
import { getProfile } from "@/backendData/queries"

export default function ProfilePage() {
  const profile = getProfile()

  return (
    <div className="relative min-h-screen w-full bg-background-light">
      <ProfileNavbar />
      <main className="flex flex-col gap-6 p-4 pb-28">
        <ProfileHeader profile={profile} />
        <ProfileStats stats={profile.stats} />
        <ProfileInterests interests={profile.interests} />
        <ProfileComments comments={profile.comments} />
      </main>
    </div>
  )
}

