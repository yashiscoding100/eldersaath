import { AddTaskForm } from "./AddTaskForm"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getActiveElder } from "@/lib/activeElder"
import { redirect } from "next/navigation"

export default async function ChildTasks() {
  const session = await auth()
  
  if (!session || session.user.role !== "CHILD") {
    redirect("/login")
  }

  const relationship = await getActiveElder(session.user.id)

  if (!relationship) {
    return (
      <div className="min-h-screen p-6 flex justify-center items-center">
        <p className="text-gray-500">Please link an elder account first.</p>
      </div>
    )
  }

  const tasks = await prisma.task.findMany({
    where: { elderId: relationship.elderId },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Care Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">Manage reminders and tasks for {relationship.elder.name}</p>
        </div>
        <div className="flex gap-4 items-center">
          <AddTaskForm elderId={relationship.elderId} />
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {tasks.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">No active tasks</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm">Create daily reminders for water, exercise, or check-ins.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-xs">
                <tr>
                  <th className="p-4 px-6">Task Title</th>
                  <th className="p-4 px-6">Description</th>
                  <th className="p-4 px-6">Frequency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map(task => (
                  <tr key={task.id} className="hover:bg-slate-50 transition group">
                    <td className="p-4 px-6 font-bold text-slate-900">{task.title}</td>
                    <td className="p-4 px-6 text-slate-600">{task.description || "-"}</td>
                    <td className="p-4 px-6 text-slate-500 uppercase tracking-wider text-xs font-semibold">{task.frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
