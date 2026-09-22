"use server"

import { auth, signIn } from "@/auth"

export async function impersonateUser(email: string | null) {
  if (!email) throw new Error("No email provided")
  
  const session = await auth()
  
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  if (!process.env.IMPERSONATION_SECRET) {
    throw new Error("Impersonation secret is not configured on the server")
  }

  // Use the secret to log in as the target user
  await signIn("credentials", {
    email,
    password: process.env.IMPERSONATION_SECRET,
    redirectTo: "/" // Redirect to home/dashboard after successful impersonation
  })
}
