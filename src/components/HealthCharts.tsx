"use client"

import { useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { format, subDays, isAfter } from 'date-fns'

type Measurement = {
  id: string
  type: string
  value: string
  timestamp: Date
}

export function HealthCharts({ measurements, variant = 'child' }: { measurements: Measurement[], variant?: 'elder' | 'child' }) {
  const [activeTab, setActiveTab] = useState('BP')
  const [timeRange, setTimeRange] = useState(30)

  // Filter and process data
  const chartData = useMemo(() => {
    const cutoffDate = subDays(new Date(), timeRange)
    
    // Filter by type and time range, then sort by timestamp
    const filtered = measurements
      .filter(m => m.type === activeTab && isAfter(new Date(m.timestamp), cutoffDate))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(m => {
        const base = {
          time: format(new Date(m.timestamp), 'MMM d, h:mm a'),
          dateObj: new Date(m.timestamp)
        }
        
        if (activeTab === 'BP') {
          // Parse "120/80"
          const [sys, dia] = m.value.split('/')
          return { ...base, sys: parseInt(sys) || 0, dia: parseInt(dia) || 0 }
        } else {
          return { ...base, value: parseFloat(m.value) || 0 }
        }
      })
      
    return filtered
  }, [measurements, activeTab, timeRange])

  const tabs = [
    { id: 'BP', label: 'Blood Pressure' },
    { id: 'SUGAR', label: 'Blood Sugar' },
    { id: 'SPO2', label: 'SpO2' },
    { id: 'PULSE', label: 'Heart Rate' },
    { id: 'TEMP', label: 'Temperature' },
    { id: 'WEIGHT', label: 'Weight' }
  ]

  const isElder = variant === 'elder'

  return (
    <div className={`bg-white rounded-3xl p-6 ${!isElder && 'shadow-xl shadow-gray-200/50 ring-1 ring-gray-900/5'}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* Tabs */}
        <div className="flex overflow-x-auto pb-2 w-full hide-scrollbar gap-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-bold transition-all ${
                activeTab === t.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              } ${isElder ? 'text-lg px-6 py-3' : 'text-sm'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex bg-slate-100 p-1 rounded-full shrink-0">
          {[7, 30, 90].map(days => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-3 py-1 text-xs font-bold rounded-full transition ${
                timeRange === days ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              } ${isElder ? 'text-base px-4 py-2' : ''}`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full">
        {chartData.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <span className="text-4xl mb-3">📈</span>
            <p className="font-medium text-center px-4">Not enough readings yet.<br/>Keep recording to see your trend.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(val) => val.split(',')[0]} 
                minTickGap={30}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                axisLine={false} 
                tickLine={false} 
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: 'bold' }} />
              
              {activeTab === 'BP' ? (
                <>
                  <Line 
                    name="Systolic"
                    type="monotone" 
                    dataKey="sys" 
                    stroke="#ef4444" 
                    strokeWidth={3} 
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    name="Diastolic"
                    type="monotone" 
                    dataKey="dia" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                </>
              ) : (
                <Line 
                  name={tabs.find(t => t.id === activeTab)?.label}
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
