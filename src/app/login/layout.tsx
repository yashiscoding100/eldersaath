import { GlobalNotice } from "@/components/GlobalNotice"

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full z-50 p-4 max-w-md mx-auto right-0">
        <GlobalNotice />
      </div>
      {children}
    </div>
  )
}
