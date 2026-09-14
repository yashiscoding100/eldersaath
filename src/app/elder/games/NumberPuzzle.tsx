"use client"

import { useState, useEffect } from "react"

export default function NumberPuzzle() {
  const [question, setQuestion] = useState({ num1: 0, num2: 0, op: "+", answer: 0 })
  const [options, setOptions] = useState<number[]>([])
  const [isWon, setIsWon] = useState(false)
  const [score, setScore] = useState(0)

  const generateQuestion = () => {
    const isAddition = Math.random() > 0.5
    let n1: number, n2: number, ans: number
    
    if (isAddition) {
      n1 = Math.floor(Math.random() * 20) + 1
      n2 = Math.floor(Math.random() * 20) + 1
      ans = n1 + n2
    } else {
      n1 = Math.floor(Math.random() * 20) + 10
      n2 = Math.floor(Math.random() * n1) // Ensure positive result
      ans = n1 - n2
    }

    // Generate 3 wrong options close to the answer
    const opts = [ans]
    while (opts.length < 4) {
      const offset = Math.floor(Math.random() * 7) - 3
      const wrong = ans + offset
      if (wrong !== ans && wrong > 0 && !opts.includes(wrong)) {
        opts.push(wrong)
      }
    }
    
    setQuestion({ num1: n1, num2: n2, op: isAddition ? "+" : "-", answer: ans })
    setOptions(opts.sort(() => Math.random() - 0.5))
    setIsWon(false)
  }

  useEffect(() => {
    generateQuestion()
  }, [])

  const handleAnswer = (selected: number) => {
    if (selected === question.answer) {
      setIsWon(true)
      setScore(s => s + 1)
    } else {
      // Just visually indicate wrong maybe, or subtract score
      alert("Oops! Try again.")
    }
  }

  if (isWon) {
    return (
      <div className="bg-white p-8 rounded-3xl text-center shadow-lg w-full max-w-md border-2 border-emerald-200">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-black text-emerald-600 mb-2">Great Job!</h2>
        <p className="text-xl text-gray-600 mb-6">Current Streak: {score}</p>
        <button onClick={generateQuestion} className="w-full bg-emerald-600 text-white font-bold text-2xl py-4 rounded-2xl hover:bg-emerald-700">
          Next Question ➡️
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 text-center">
      <div className="flex justify-between items-center mb-6">
        <span className="text-emerald-800 font-bold bg-emerald-50 px-4 py-1 rounded-full">Score: {score}</span>
      </div>

      <h2 className="text-gray-500 font-bold mb-4 text-xl">Solve this:</h2>
      
      <div className="text-6xl font-black text-gray-900 mb-10 tracking-widest">
        {question.num1} {question.op} {question.num2} = ?
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            className="bg-emerald-100 text-emerald-900 hover:bg-emerald-200 text-4xl font-black py-6 rounded-2xl border-2 border-emerald-300 transition-colors shadow-sm"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
