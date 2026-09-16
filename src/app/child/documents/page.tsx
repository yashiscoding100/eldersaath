import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { UploadDocumentForm } from "./UploadDocumentForm"
import { DocumentRow } from "./DocumentRow"

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
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Medical Vault</h1>
          <p className="text-sm text-slate-500 mt-1">Manage documents for {relationship.elder.name}</p>
        </div>
        <div className="flex gap-4 items-center">
          <UploadDocumentForm elderId={relationship.elderId} />
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {documents.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">No documents found</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm">Upload prescriptions, lab reports, or medical records for safekeeping.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-xs">
                <tr>
                  <th className="p-4 px-6">Document Name</th>
                  <th className="p-4 px-6">Type</th>
                  <th className="p-4 px-6">Date Added</th>
                  <th className="p-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map(doc => (
                  <DocumentRow key={doc.id} doc={doc} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
