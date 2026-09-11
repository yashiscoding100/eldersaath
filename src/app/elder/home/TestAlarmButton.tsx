"use client"

export function TestAlarmButton() {
  return (
    <button 
      onClick={() => {
        window.dispatchEvent(new Event("trigger-alarm"))
      }}
      className="block w-full bg-orange-100 hover:bg-orange-200 text-orange-900 rounded-2xl p-6 text-left shadow-sm transition-colors flex items-center justify-between border border-orange-200 mt-4"
    >
      <div>
        <h2 className="text-2xl font-bold">Test Alarm</h2>
        <p className="text-lg opacity-80 mt-1">Tap to simulate ringing</p>
      </div>
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
        ⏰
      </div>
    </button>
  )
}
