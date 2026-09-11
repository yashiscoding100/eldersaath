"use client"

import { useState } from "react"
import MemoryGame from "./MemoryGame"
import TicTacToe from "./TicTacToe"
import WordPuzzle from "./WordPuzzle"
import NumberPuzzle from "./NumberPuzzle"
import TriviaGame from "./TriviaGame"
import StroopTest from "./StroopTest"

export function GameMenu() {
  const [activeGame, setActiveGame] = useState<string | null>(null)

  const games = [
    { id: "memory", title: "Memory Match", icon: "🧠", color: "bg-purple-100 text-purple-900", desc: "Find the matching pairs" },
    { id: "stroop", title: "Color Match (Stroop)", icon: "🎨", color: "bg-orange-100 text-orange-900", desc: "Brain flexibility test" },
    { id: "trivia", title: "World Trivia", icon: "🌍", color: "bg-indigo-100 text-indigo-900", desc: "Historical & Geo recall" },
    { id: "tictactoe", title: "Tic Tac Toe", icon: "❌", color: "bg-blue-100 text-blue-900", desc: "Classic 3-in-a-row" },
    { id: "word", title: "Word Puzzle", icon: "📝", color: "bg-yellow-100 text-yellow-900", desc: "Unscramble the letters" },
    { id: "number", title: "Number Sudoku", icon: "🔢", color: "bg-emerald-100 text-emerald-900", desc: "Simple math puzzles" },
  ]

  if (activeGame === "memory") {
    return (
      <div className="w-full flex flex-col items-center">
        <button onClick={() => setActiveGame(null)} className="mb-6 self-start text-purple-600 font-bold bg-purple-50 px-4 py-2 rounded-xl">
          ← Back to Menu
        </button>
        <MemoryGame />
      </div>
    )
  }

  if (activeGame === "tictactoe") {
    return (
      <div className="w-full flex flex-col items-center">
        <button onClick={() => setActiveGame(null)} className="mb-6 self-start text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-xl">
          ← Back to Menu
        </button>
        <TicTacToe />
      </div>
    )
  }

  if (activeGame === "word") {
    return (
      <div className="w-full flex flex-col items-center">
        <button onClick={() => setActiveGame(null)} className="mb-6 self-start text-yellow-600 font-bold bg-yellow-50 px-4 py-2 rounded-xl">
          ← Back to Menu
        </button>
        <WordPuzzle />
      </div>
    )
  }

  if (activeGame === "number") {
    return (
      <div className="w-full flex flex-col items-center">
        <button onClick={() => setActiveGame(null)} className="mb-6 self-start text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-xl">
          ← Back to Menu
        </button>
        <NumberPuzzle />
      </div>
    )
  }

  if (activeGame === "stroop") {
    return (
      <div className="w-full flex flex-col items-center">
        <button onClick={() => setActiveGame(null)} className="mb-6 self-start text-orange-600 font-bold bg-orange-50 px-4 py-2 rounded-xl">
          ← Back to Menu
        </button>
        <StroopTest />
      </div>
    )
  }

  if (activeGame === "trivia") {
    return (
      <div className="w-full flex flex-col items-center">
        <button onClick={() => setActiveGame(null)} className="mb-6 self-start text-indigo-600 font-bold bg-indigo-50 px-4 py-2 rounded-xl">
          ← Back to Menu
        </button>
        <TriviaGame />
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-4 flex-1">
      {games.map((game) => (
        <button 
          key={game.id} 
          onClick={() => setActiveGame(game.id)}
          className={`w-full ${game.color} rounded-2xl p-6 text-left shadow-sm transition-colors flex items-center justify-between border border-gray-200 border-opacity-50 hover:scale-105 transform`}
        >
          <div>
            <h2 className="text-2xl font-bold">{game.title}</h2>
            <p className="text-lg opacity-80 mt-1">{game.desc}</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-2xl">
            {game.icon}
          </div>
        </button>
      ))}
    </div>
  )
}
