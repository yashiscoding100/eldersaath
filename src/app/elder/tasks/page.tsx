import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function ElderTasks() {
  const session = await auth()

  if (!session || session.user.role !== "ELDER") {
    redirect("/login")
  }

  const tasks = await prisma.task.findMany({
    where: { elderId: session.user.id },
    include: {
      logs: {
        where: {
          timestamp: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-sm mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Your Wellbeing</h1>
        <p className="text-gray-500 mt-2">Gentle reminders & care notes for you 🌸</p>
      </div>

      <div className="w-full max-w-md space-y-4 flex-1">
        {tasks.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
             <p className="text-xl text-gray-600">No specific notes for today. Have a wonderful day!</p>
          </div>
        ) : (
          tasks.map(task => {
            const isCompleted = task.logs.some(l => l.status === "COMPLETED")
            return (
              <div key={task.id} className={`p-6 rounded-2xl shadow-sm border flex items-center justify-between transition-colors ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
                <div>
                  <h2 className={`text-2xl font-bold ${isCompleted ? 'text-green-800 line-through opacity-70' : 'text-gray-900'}`}>
                    {task.title}
                  </h2>
                  {task.description && <p className="text-lg text-gray-500 mt-1">{task.description}</p>}
                </div>
                {!isCompleted && (
                  <form action={async () => {
                    "use server"
                    await prisma.taskLog.create({ data: { taskId: task.id, elderId: session.user.id } })
                  }}>
                    <button type="submit" className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
                      ◯
                    </button>
                  </form>
                )}
                {isCompleted && (
                  <div className="w-12 h-12 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-2xl font-bold">
                    ✓
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
      
      <div className="w-full max-w-md pt-6">
        <a href="/elder/home" className="block w-full py-4 text-center bg-gray-200 text-gray-800 font-bold rounded-2xl text-xl hover:bg-gray-300 transition-colors">
          Back Home
        </a>
      </div>
    </div>
  )
}
