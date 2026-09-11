import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session || session.user.role !== "CHILD") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { elderId, title, fileType, fileData } = await req.json()

    // Authorization Check
    const relationship = await prisma.caregiverRelationship.findUnique({
      where: {
        elderId_childId: { elderId, childId: session.user.id }
      }
    })

    if (!relationship || relationship.status !== "ACTIVE") {
       return NextResponse.json({ message: "Unauthorized for this elder" }, { status: 403 })
    }

    // In a real production app, `fileData` would be uploaded to S3 or similar.
    // For MVP, we'll assume `fileData` is a base64 string or just a mock URL.
    const document = await prisma.medicalDocument.create({
      data: {
        elderId,
        uploaderId: session.user.id,
        title,
        fileType,
        fileUrl: fileData // Storing base64 directly for demo (not recommended for prod)
      }
    })
    
    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to upload document" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const elderId = searchParams.get("elderId")

  if (!elderId) return NextResponse.json({ message: "Missing elderId" }, { status: 400 })

  // Authorization Check
  if (session.user.role === "CHILD") {
    const relationship = await prisma.caregiverRelationship.findUnique({
      where: { elderId_childId: { elderId, childId: session.user.id } }
    })
    if (!relationship) return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  } else if (session.user.role === "ELDER" && session.user.id !== elderId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  const docs = await prisma.medicalDocument.findMany({
    where: { elderId },
    orderBy: { uploadedAt: 'desc' }
  })

  return NextResponse.json(docs, { status: 200 })
}
