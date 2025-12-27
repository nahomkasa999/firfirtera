"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChatInput() {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      // TODO: Send message to backend
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-10 bg-background-light p-4 pt-3 border-t border-border">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <label className="flex h-12 flex-1 flex-col min-w-40">
          <div className="flex h-full w-full flex-1 items-stretch rounded-full">
            <Input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex h-full min-w-0 flex-1 resize-none overflow-hidden rounded-full border-none bg-muted px-4 text-base font-normal leading-normal text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0"
            />
          </div>
        </label>
        <Button
          type="submit"
          size="icon"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          aria-label="Send message"
        >
          <Send className="h-6 w-6" />
        </Button>
      </form>
    </footer>
  )
}


