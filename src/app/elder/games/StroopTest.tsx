"use client"

import { useState, useEffect } from "react"

const COLORS = [
  { name: "RED", code: "text-red-500" },
  { name: "BLUE", code: "text-blue-500" },
  { name: "GREEN", code: "text-green-500" },
  { name: "YELLOW", code: "text-yellow-500" }
]

export default function StroopTest() {
  const [targetWord, setTargetWord] = useState(COLORS[0].name)
  const [targetColor, setTargetColor] = useState(COLORS[1].code)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isGameOver, setIsGameOver] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const generateNext = () => {
    // Pick a random word
    const wordIdx = Math.floor(Math.random() * COLORS.length)
    // Pick a random color (preferably different from the word to cause the Stroop Effect)
    let colorIdx = Math.floor(Math.random() * COLORS.length)
    if (Math.random() > 0.3 && colorIdx === wordIdx) {
        colorIdx = (colorIdx + 1) % COLORS.length
    }
    
    setTargetWord(COLORS[wordIdx].name)
    setTargetColor(COLORS[colorIdx].code)
  }

  const startGame = () => {
    setScore(0)
    setTimeLeft(30)
    setIsGameOver(false)
    setIsPlaying(true)
    generateNext()
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isPlaying) {
      setIsGameOver(true)
      setIsPlaying(false)
    }
    return () => clearInterval(timer)
  }, [isPlaying, timeLeft])

  const handleTap = (colorName: string) => {
    // The correct answer is the COLOR OF THE INK, not the word text
    const actualColorName = COLORS.find(c => c.code === targetColor)?.name
    
    if (colorName === actualColorName) {
      setScore(s => s + 1)
      generateNext()
    } else {
      // Penalty for wrong tap
      setTimeLeft(prev => Math.max(0, prev - 2))
    }
  }

  if (!isPlaying && !isGameOver) {
    return (
      <div className="bg-white p-8 rounded-3xl text-center shadow-lg w-full max-w-md border-2 border-orange-200">
        <div className="text-6xl mb-4">🧠</div>
        <h2 className="text-3xl font-black text-orange-600 mb-4">The Stroop Test</h2>
        <p className="text-lg text-gray-900 font-bold mb-6">
          Tap the button matching the <span className="underline text-red-500 font-black">COLOR OF THE INK</span>, not the word itself!
        </p>
        <button onClick={startGame} className="w-full bg-orange-500 text-white font-bold text-2xl py-4 rounded-2xl hover:bg-orange-600">
          Start 30s Test
        </button>
      </div>
    )
  }

  if (isGameOver) {
    return (
      <div className="bg-white p-8 rounded-3xl text-center shadow-lg w-full max-w-md border-2 border-orange-200 animate-bounce">
        <div className="text-6xl mb-4">⏱️</div>
        <h2 className="text-3xl font-black text-orange-600 mb-2">Time's Up!</h2>
        <p className="text-xl text-gray-900 font-bold mb-6">You scored {score} points.</p>
        <button onClick={startGame} className="w-full bg-orange-500 text-white font-bold text-2xl py-4 rounded-2xl hover:bg-orange-600">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-sm border border-orange-100 text-center">
      <div className="flex justify-between items-center mb-10">
        <span className="text-orange-800 font-bold bg-orange-50 px-4 py-1 rounded-full">Score: {score}</span>
        <span className="text-red-600 font-black text-xl">{timeLeft}s</span>
      </div>

      <div className="mb-12">
        <h2 className={`text-6xl font-black tracking-widest uppercase ${targetColor}`}>
          {targetWord}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {COLORS.map((c) => (
          <button
            key={c.name}
            onClick={() => handleTap(c.name)}
            className="bg-gray-100 text-gray-900 hover:bg-gray-200 text-2xl font-black py-6 rounded-2xl border-2 border-gray-300 transition-colors shadow-sm"
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}
