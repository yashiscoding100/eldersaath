"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Trash2 } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

type Notification = {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  link: string | null
  createdAt: string
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.isRead).length

  useEffect(() => {
    fetchNotifications()
    // Poll every 30 seconds for MVP
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications")
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications?id=${id}`, { method: "PATCH" })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (e) {
      console.error(e)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch(`/api/notifications?all=true`, { method: "PATCH" })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (e) {}
  }
  
  const clearAll = async () => {
    try {
      await fetch(`/api/notifications?all=true`, { method: "DELETE" })
      setNotifications([])
    } catch (e) {}
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-900">Notifications {unreadCount > 0 && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs ml-2">{unreadCount} new</span>}</h3>
              <div className="flex gap-2">
                <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-800 font-medium p-1 flex items-center" title="Mark all read"><Check className="w-4 h-4" /></button>
                <button onClick={clearAll} className="text-xs text-slate-400 hover:text-slate-600 font-medium p-1 flex items-center" title="Clear all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  No new notifications
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`p-4 transition hover:bg-slate-50 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.isRead ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900">{notif.title}</p>
                          <p className="text-sm text-slate-600 mt-0.5">{notif.message}</p>
                          <p className="text-xs text-slate-400 mt-2 font-medium">{formatDistanceToNow(new Date(notif.createdAt), {addSuffix: true})}</p>
                          
                          {notif.link && (
                            <Link href={notif.link} onClick={() => { markAsRead(notif.id); setIsOpen(false) }} className="inline-block mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-md">
                              View Details &rarr;
                            </Link>
                          )}
                          {!notif.link && !notif.isRead && (
                             <button onClick={() => markAsRead(notif.id)} className="mt-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                               Mark as read
                             </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
