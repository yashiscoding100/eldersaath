"use client"

import { useEffect, useState } from "react"

export function AiInsights({ elderId }: { elderId: string }) {
  const [insight, setInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const res = await fetch(`/api/health/ai-analysis?elderId=${elderId}`)
        if (res.ok) {
          const data = await res.json()
          setInsight(data.insight)
        }
      } catch (error) {
        console.error("Failed to fetch AI insights", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInsight()
  }, [elderId])

  if (loading) {
    return (
      <div className="w-full bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100 flex items-center gap-3 animate-pulse">
        <div className="w-8 h-8 bg-indigo-200 rounded-full"></div>
        <div className="h-4 bg-indigo-200 rounded w-2/3"></div>
      </div>
    )
  }

  if (!insight) return null

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-indigo-100/50 shadow-sm relative overflow-hidden h-full flex flex-col justify-center">
      <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl transform translate-x-4 -translate-y-4">✨</div>
      <div className="flex gap-4 relative z-10">
        <div className="text-2xl mt-1">🤖</div>
        <div>
          <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
            AI Health Insights
            <span className="text-[10px] bg-white border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded-md uppercase tracking-wider font-bold">Beta</span>
          </h4>
          <p className="text-slate-700 text-sm leading-relaxed mt-2">{insight}</p>
          <p className="text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-wider">
            Disclaimer: AI-generated trend based on past 30 days. Not a medical diagnosis.
          </p>
        </div>
      </div>
    </div>
  )
}
