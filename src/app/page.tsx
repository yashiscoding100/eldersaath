import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold text-blue-600 tracking-tight mb-4">
          Elder Saath
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Because distance shouldn't mean less care. A complete ecosystem to help you care for your elderly parents remotely.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/login" 
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="px-8 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}
