import MessagesNavbar from "./_components/MessagesNavbar"
import MessagesList from "./_components/MessagesList"
import { getMessagesList } from "@/backendData/queries"

export default function MessagesPage() {
  const messagesData = getMessagesList()

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light">
      <MessagesNavbar />
      <main className="flex flex-1 flex-col pb-28">
        <MessagesList messagesData={messagesData} />
      </main>
    </div>
  )
}


