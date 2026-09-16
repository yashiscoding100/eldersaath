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
    <div className="w-full bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-100 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">✨</div>
      <div className="flex gap-4 relative z-10">
        <div className="text-2xl mt-1">🤖</div>
        <div>
          <h4 className="font-bold text-indigo-900 mb-1 flex items-center gap-2">
            AI Health Insight
            <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Beta</span>
          </h4>
          <p className="text-indigo-800 text-sm leading-relaxed">{insight}</p>
          <p className="text-[10px] text-indigo-400 mt-2 font-medium uppercase tracking-wider">
            Disclaimer: This is a health-data trend, not a medical diagnosis.
          </p>
        </div>
      </div>
    </div>
  )
}
