import ChatNavbar from "./_components/ChatNavbar"
import ChatMessages from "./_components/ChatMessages"
import ChatInput from "./_components/ChatInput"
import { getChatDetail } from "@/backendData/queries"
import { notFound } from "next/navigation"

export default async function ChatPage({
  params,
}: {
  params: Promise<{ mealId: string }>
}) {
  const { mealId } = await params
  const chatData = getChatDetail(mealId)

  if (!chatData) {
    notFound()
  }

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light">
      <ChatNavbar chatData={chatData} />
      <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pb-24">
        <ChatMessages messages={chatData.messages} />
      </main>
      <ChatInput />
    </div>
  )
}


