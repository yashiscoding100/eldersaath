import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    // Add the sosEnabled column manually to bypass the need for npx prisma db push
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "sosEnabled" BOOLEAN NOT NULL DEFAULT false;`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "canManageMeds" BOOLEAN NOT NULL DEFAULT false;`)
    
    return NextResponse.json({ 
      success: true, 
      message: "Database updated successfully! You can now use the SOS toggle in the app." 
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ 
      success: false, 
      message: "Migration failed. It might already be applied.", 
      error: error?.message 
    }, { status: 500 })
  }
}
