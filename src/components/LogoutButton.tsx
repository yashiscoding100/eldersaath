"use client"

import { signOut } from "next-auth/react"

export function LogoutButton() {
  return (
    <button
      onClick={() => {
        localStorage.removeItem("es_persistent_email")
        localStorage.removeItem("es_persistent_password")
        signOut({ callbackUrl: "/" })
      }}
      className="text-sm text-gray-500 hover:text-red-500 transition-colors"
    >
      Sign Out
    </button>
  )
}
