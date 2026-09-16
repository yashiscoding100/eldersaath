import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { uploadDocument, deleteDocument } from "@/lib/storage"

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

    const safeFilename = `${elderId}-${Date.now()}`
    const fileUrl = await uploadDocument(fileData, safeFilename)

    const document = await prisma.medicalDocument.create({
      data: {
        elderId,
        uploaderId: session.user.id,
        title,
        fileType,
        fileUrl
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

export async function DELETE(req: Request) {
  const session = await auth()
  
  if (!session || session.user.role !== "CHILD") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) return NextResponse.json({ message: "Missing document id" }, { status: 400 })

    const document = await prisma.medicalDocument.findUnique({
      where: { id }
    })

    if (!document) return NextResponse.json({ message: "Not found" }, { status: 404 })

    // Security Authorization Check - Ensure this child actually manages this elder
    const relationship = await prisma.caregiverRelationship.findUnique({
      where: {
        elderId_childId: { elderId: document.elderId, childId: session.user.id }
      }
    })

    if (!relationship || relationship.status !== "ACTIVE") {
       return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await deleteDocument(document.fileUrl)

    await prisma.medicalDocument.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete document" }, { status: 500 })
  }
}
