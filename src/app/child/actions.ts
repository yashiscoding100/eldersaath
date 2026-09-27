"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function setActiveElderAction(elderId: string) {
  const cookieStore = await cookies()
  
  // Set the cookie via server action (100% reliable across all browsers)
  cookieStore.set("activeElderId", elderId, {
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true
  })
  
  // Force Next.js to purge the router cache and re-fetch Server Components!
  revalidatePath("/", "layout")
}
