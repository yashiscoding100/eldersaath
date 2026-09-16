// Storage abstraction for Medical Documents
// In production, this should connect to AWS S3, Vercel Blob, or similar.

export async function uploadDocument(base64Data: string, filename: string): Promise<string> {
  // If S3 credentials are provided in the environment, use them.
  if (process.env.AWS_S3_BUCKET && process.env.AWS_ACCESS_KEY_ID) {
    // TODO: Implement actual AWS S3 SDK upload here
    // const s3 = new S3Client(...)
    // const result = await s3.send(new PutObjectCommand(...))
    // return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${filename}`
    console.warn("S3 configured but SDK not implemented. Falling back to DB storage.")
  }
  
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // TODO: Implement Vercel Blob upload here
    // const { url } = await put(filename, buffer, { access: 'public' })
    // return url
    console.warn("Vercel Blob configured but SDK not implemented. Falling back to DB storage.")
  }

  // MVP Fallback: Return the base64 string to be stored in the database.
  // WARNING: This will crash the database in production if many large files are uploaded.
  return base64Data
}

export async function deleteDocument(fileUrl: string) {
  if (fileUrl.startsWith("http")) {
    // TODO: Implement S3/Blob deletion logic
    console.log("Mock deleting from external storage:", fileUrl)
  }
  // If it's base64, nothing to do on the file system/storage layer.
}
