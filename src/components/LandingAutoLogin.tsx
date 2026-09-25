"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LandingAutoLogin() {
  const router = useRouter()

  useEffect(() => {
    // If the user has saved credentials, instantly redirect them to the login page 
    // so the "Restoring your session" logic can run automatically without them clicking Sign In.
    const savedEmail = localStorage.getItem("es_persistent_email")
    if (savedEmail) {
      router.push("/login")
    }
  }, [router])

  return null
}
