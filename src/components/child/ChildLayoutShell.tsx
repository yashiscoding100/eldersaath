"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Activity, 
  Pill, 
  ListTodo, 
  FileText, 
  Files, 
  AlertTriangle, 
  Users, 
  Settings,
  Menu,
  X,
  Bell,
  Search,
  LogOut
} from "lucide-react"

import { signOut } from "next-auth/react"

const NAV_ITEMS = [
  { name: "Dashboard", href: "/child/dashboard", icon: LayoutDashboard },
  { name: "Health Analytics", href: "/child/health", icon: Activity },
  { name: "Medications", href: "/child/medications", icon: Pill },
  { name: "Tasks", href: "/child/tasks", icon: ListTodo },
  { name: "Reports", href: "/child/reports", icon: FileText },
  { name: "Documents", href: "/child/documents", icon: Files },
  { name: "Emergency Center", href: "/child/emergency", icon: AlertTriangle },
  { name: "Care Network", href: "/child/care-network", icon: Users },
  { name: "Settings", href: "/child/settings", icon: Settings },
]

export function ChildLayoutShell({ 
  children, 
  elderName = "Mom", 
  userName = "Family Member",
  parentCount = 0,
  hasEmergency = false 
}: { 
  children: React.ReactNode, 
  elderName?: string, 
  userName?: string,
  parentCount?: number,
  hasEmergency?: boolean
  elders?: { id: string, name: string }[]
  activeElderId?: string
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [elderDropdownOpen, setElderDropdownOpen] = useState(false)
  const elderDropdownRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setDropdownOpen(false)
        }
        if (elderDropdownRef.current && !elderDropdownRef.current.contains(event.target as Node)) {
          setElderDropdownOpen(false)
        }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const AvatarDropdown = () => (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all outline-none"
      >
        {userName.charAt(0).toUpperCase()}
      </button>
      
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 animate-fade-in">
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
          </div>
          <Link 
            href="/child/settings"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
          >
            <Settings className="w-4 h-4" />
            Account Settings
          </Link>
          <button 
            onClick={() => { localStorage.removeItem("es_persistent_email"); localStorage.removeItem("es_persistent_password"); signOut({ callbackUrl: "/" }); }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenuOpen(true)} className="p-1 -ml-1 text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg tracking-tight">ElderSaath</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/child/settings" className="relative cursor-pointer hover:bg-slate-100 p-2 rounded-full transition" title="Notification Settings">
            <Bell className="w-5 h-5 text-slate-500" />
            {hasEmergency && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
          </Link>
          <AvatarDropdown />
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-50 md:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col
        md:translate-x-0 md:static md:w-64 md:shrink-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <span className="font-black text-xl tracking-tight text-slate-900">ElderSaath</span>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden p-1 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
              <button 
                onClick={() => { localStorage.removeItem("es_persistent_email"); localStorage.removeItem("es_persistent_password"); signOut({ callbackUrl: "/" }); }}
                className="text-xs font-semibold text-slate-500 hover:text-red-600 transition truncate mt-0.5 flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" /> Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                Care Recipient
                {parentCount > 0 && (
                  <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {parentCount} Linked
                  </span>
                )}
              </span>
              <button className="flex items-center gap-1 font-bold text-slate-900 hover:text-blue-600 transition-colors">
                {elderName} <span className="text-[10px]">▼</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-64"
              />
            </div>
            <Link href="/child/settings" className="relative p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors" title="Notification Settings">
              <Bell className="w-5 h-5" />
              {hasEmergency && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
            </Link>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <AvatarDropdown />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>

    </div>
  )
}
