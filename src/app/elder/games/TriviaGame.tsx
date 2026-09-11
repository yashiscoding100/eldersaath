"use client"

import { useState } from "react"

// Dataset fetched directly from the OpenTDB Internet API (Open Trivia Database)
const TRIVIA_DATASET = [
  {
      "question": "Which of the following Japanese islands is the biggest?",
      "correct": "Honshu",
      "options": ["Hokkaido", "Shikoku", "Kyushu", "Honshu"]
  },
  {
      "question": "What is Russia's second-largest city?",
      "correct": "Saint Petersburg",
      "options": ["Minsk", "Saint Petersburg", "Nizhny Novgorod", "Vladivostok"]
  },
  {
      "question": "What is the capital of Finland?",
      "correct": "Helsinki",
      "options": ["Oslo", "Helsinki", "Copenhagen", "Stockholm"]
  },
  {
      "question": "How many countries does Mexico border?",
      "correct": "3",
      "options": ["1", "2", "3", "4"]
  },
  {
      "question": "What is the smallest country in the world?",
      "correct": "Vatican City",
      "options": ["Maldives", "Monaco", "Malta", "Vatican City"]
  },
  {
      "question": "What is the capital of India?",
      "correct": "New Delhi",
      "options": ["Beijing", "Mumbai", "New Delhi", "Kolkata"]
  },
  {
      "question": "Which of these is NOT an Australian state or territory?",
      "correct": "Alberta",
      "options": ["New South Wales", "Victoria", "Alberta", "Queensland"]
  },
  {
      "question": "Which US state is furthest north east?",
      "correct": "Maine",
      "options": ["New York", "Maine", "Massachusetts", "Vermont"]
  },
  {
      "question": "What is the capital of South Korea?",
      "correct": "Seoul",
      "options": ["Pyongyang", "Seoul", "Busan", "Incheon"]
  },
  {
      "question": "What is the capital of Scotland?",
      "correct": "Edinburgh",
      "options": ["Glasgow", "Edinburgh", "Dundee", "Aberdeen"]
  }
]

export default function TriviaGame() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  
  const question = TRIVIA_DATASET[currentIdx]

  const handleSelect = (option: string) => {
    if (selected) return // prevent double click
    setSelected(option)
    
    if (option === question.correct) {
      setScore(s => s + 1)
    }

    setTimeout(() => {
      if (currentIdx < TRIVIA_DATASET.length - 1) {
        setCurrentIdx(currentIdx + 1)
        setSelected(null)
      } else {
        setIsDone(true)
      }
    }, 1500)
  }

  const restart = () => {
    setCurrentIdx(0)
    setScore(0)
    setIsDone(false)
    setSelected(null)
  }

  if (isDone) {
    return (
      <div className="bg-white p-8 rounded-3xl text-center shadow-lg w-full max-w-md border-2 border-indigo-200">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-black text-indigo-600 mb-2">Quiz Complete!</h2>
        <p className="text-xl text-gray-900 font-bold mb-6">You scored {score} out of {TRIVIA_DATASET.length}!</p>
        <button onClick={restart} className="w-full bg-indigo-600 text-white font-bold text-2xl py-4 rounded-2xl hover:bg-indigo-700">
          Play Again
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-sm border border-indigo-100">
      <div className="flex justify-between items-center mb-6">
        <span className="text-indigo-800 font-bold bg-indigo-50 px-4 py-1 rounded-full">Score: {score}</span>
        <span className="text-gray-500 font-bold text-sm">Question {currentIdx + 1} of {TRIVIA_DATASET.length}</span>
      </div>

      <h2 className="text-gray-900 font-bold mb-8 text-2xl leading-relaxed">
        {question.question}
      </h2>

      <div className="grid gap-4">
        {question.options.map((opt, i) => {
          let btnClass = "bg-gray-50 text-gray-900 border-gray-200 hover:bg-gray-100"
          
          if (selected) {
            if (opt === question.correct) {
              btnClass = "bg-green-100 border-green-500 text-green-900"
            } else if (opt === selected) {
              btnClass = "bg-red-100 border-red-500 text-red-900"
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={!!selected}
              className={`w-full text-xl font-bold py-5 px-4 rounded-2xl border-2 transition-colors text-left shadow-sm ${btnClass}`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
