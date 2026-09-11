import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { UploadDocumentForm } from "./UploadDocumentForm"

export default async function ChildDocuments() {
  const session = await auth()
  
  if (!session || session.user.role !== "CHILD") {
    redirect("/login")
  }

  const relationship = await prisma.caregiverRelationship.findFirst({
    where: { childId: session.user.id },
    include: { elder: true },
  })

  if (!relationship) {
    return (
      <div className="min-h-screen p-6 flex justify-center items-center">
        <p className="text-gray-500">Please link an elder account first.</p>
      </div>
    )
  }

  const documents = await prisma.medicalDocument.findMany({
    where: { elderId: relationship.elderId },
    orderBy: { uploadedAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Medical Vault</h1>
            <p className="text-gray-500 font-medium">Documents for {relationship.elder.name}</p>
          </div>
          <UploadDocumentForm elderId={relationship.elderId} />
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 font-medium text-lg">No medical documents uploaded yet.</p>
              <p className="text-gray-400 mt-2">Upload prescriptions, test results, or IDs for safekeeping.</p>
            </div>
          ) : (
            documents.map(doc => (
              <div key={doc.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-2xl">
                      {doc.fileType.includes("pdf") ? "📄" : "🖼️"}
                    </div>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {doc.uploadedAt.toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{doc.title}</h3>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{doc.fileType.split('/')[1] || doc.fileType}</p>
                </div>
                
                <a 
                  href={doc.fileUrl} 
                  download={`${doc.title}.${doc.fileType.split('/')[1] || 'pdf'}`}
                  className="mt-6 w-full block text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-2 rounded-lg transition"
                >
                  Download / View
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
