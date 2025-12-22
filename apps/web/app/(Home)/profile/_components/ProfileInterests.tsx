"use client"

interface ProfileInterestsProps {
  interests: string[]
}

export default function ProfileInterests({ interests }: ProfileInterestsProps) {
  if (!interests || interests.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold text-foreground">Interests</h3>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest, index) => (
          <span
            key={index}
            className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
          >
            {interest}
          </span>
        ))}
      </div>
    </div>
  )
}

