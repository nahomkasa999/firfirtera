"use client"

import { useState } from "react"
import { HelpCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FieldHelpProps {
  helpText: string
  className?: string
}

export default function FieldHelp({ helpText, className }: FieldHelpProps) {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowHelp(!showHelp)}
        className={cn(
          "text-muted-foreground hover:text-foreground transition-colors",
          className
        )}
        aria-label="Show help"
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      
      {showHelp && (
        <div className="absolute left-0 top-6 z-50 w-64 rounded-lg border border-border bg-popover p-3 text-sm text-popover-foreground shadow-md">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs leading-relaxed">{helpText}</p>
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close help"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

