import { NextResponse } from "next/server"
import { auth } from "@/auth"
import Tesseract from "tesseract.js"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session || session.user.role !== "ELDER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { imageBase64 } = await req.json()
    
    if (!imageBase64) {
      return NextResponse.json({ message: "No image provided" }, { status: 400 })
    }

    // Pass the base64 image into Tesseract
    const { data: { text } } = await Tesseract.recognize(
      imageBase64,
      'eng',
      { logger: m => console.log(m) }
    )

    console.log("OCR Extracted raw text:", text)

    // A very simple regex to try and find Blood pressure (SYS / DIA) 
    // Omron monitors usually display the numbers stacked vertically.
    // Tesseract often reads this as "184 \n 94 \n 89" for Sys, Dia, Pulse.
    // Let's extract any 2-3 digit numbers to try to intelligently build a BP reading
    
    const numbers = text.match(/\b\d{2,3}\b/g)
    
    let bp = ""
    let pulse = ""
    
    if (numbers && numbers.length >= 2) {
      // Assuming the first large number is systolic, second is diastolic
      bp = `${numbers[0]}/${numbers[1]}`
      
      if (numbers.length >= 3) {
         pulse = numbers[2]
      }
    }

    return NextResponse.json({ 
        success: true, 
        extractedData: {
            bp: bp,
            pulse: pulse,
            raw: text
        }
    }, { status: 200 })
  } catch (error) {
    console.error("OCR Error:", error)
    return NextResponse.json({ message: "OCR failed" }, { status: 500 })
  }
}
