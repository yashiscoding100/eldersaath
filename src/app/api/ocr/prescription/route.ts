import { NextResponse } from "next/server"
import { auth } from "@/auth"
import Tesseract from "tesseract.js"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session || session.user.role !== "CHILD") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { imageBase64 } = await req.json()
    
    if (!imageBase64) {
      return NextResponse.json({ message: "No image provided" }, { status: 400 })
    }

    const { data: { text } } = await Tesseract.recognize(
      imageBase64,
      'eng'
    )

    console.log("Prescription OCR text:", text)

    // Heuristics for Prescription parsing
    // This is not perfect, it's just extracting hints for the human to verify
    let name = ""
    let dosage = ""
    let frequency = ""

    const lowerText = text.toLowerCase()
    
    // Look for common mg/ml patterns
    const dosageMatch = lowerText.match(/(\d+)\s*(mg|ml|mcg|g)\b/)
    if (dosageMatch) {
      dosage = dosageMatch[0]
    }

    // Look for common frequency patterns
    if (lowerText.includes("twice") || lowerText.includes("b.i.d") || lowerText.includes("bid")) {
      frequency = "Twice a day"
    } else if (lowerText.includes("thrice") || lowerText.includes("t.i.d") || lowerText.includes("tid")) {
      frequency = "Three times a day"
    } else if (lowerText.includes("once") || lowerText.includes("daily") || lowerText.includes("q.d") || lowerText.includes("qd")) {
      frequency = "Once a day"
    } else if (lowerText.includes("as needed") || lowerText.includes("p.r.n") || lowerText.includes("prn")) {
      frequency = "As needed"
    }

    // Try to guess the name (usually the word before the dosage, or first line)
    const lines = text.split('\n').filter(l => l.trim().length > 3)
    if (lines.length > 0) {
      // Very naive: just take the first substantial line as the name
      // Real OCR pipelines use NLP here. We just provide a starting point.
      name = lines[0].replace(/[^a-zA-Z0-9 ]/g, "").trim()
    }

    return NextResponse.json({ 
        success: true, 
        extractedData: {
            name,
            dosage,
            frequency,
            raw: text
        }
    }, { status: 200 })
  } catch (error) {
    console.error("Prescription OCR Error:", error)
    return NextResponse.json({ message: "OCR failed" }, { status: 500 })
  }
}
