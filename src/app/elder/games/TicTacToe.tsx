"use client"

import { useState } from "react"

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  const calculateWinner = (squares: any[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const handleClick = (i: number) => {
    if (board[i] || calculateWinner(board)) return
    
    const newBoard = [...board]
    newBoard[i] = xIsNext ? "❌" : "⭕"
    setBoard(newBoard)
    setXIsNext(!xIsNext)
  }

  const winner = calculateWinner(board)
  const isDraw = !winner && board.every(Boolean)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setXIsNext(true)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-6">
        {winner ? (
          <h2 className="text-3xl font-black text-green-600 animate-bounce">{winner} Wins! 🎉</h2>
        ) : isDraw ? (
          <h2 className="text-3xl font-black text-orange-500">It's a Draw! 🤝</h2>
        ) : (
          <h2 className="text-2xl font-bold text-gray-700">Next player: {xIsNext ? "❌" : "⭕"}</h2>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 bg-blue-100 p-3 rounded-2xl">
        {board.map((square, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="aspect-square bg-white rounded-xl text-5xl flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
          >
            {square}
          </button>
        ))}
      </div>

      <button 
        onClick={resetGame}
        className="w-full mt-6 bg-blue-600 text-white font-bold text-2xl py-4 rounded-2xl hover:bg-blue-700 transition-colors"
      >
        Restart Game
      </button>
    </div>
  )
}
