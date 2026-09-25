"use client"

import { useState } from "react"
import { NotificationModal } from "./NotificationModal"

export function BroadcastButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 shadow-md shadow-indigo-600/20"
      >
        <span>📣</span> Broadcast Message
      </button>

      <NotificationModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        targetUserId="ALL"
      />
    </>
  )
}
