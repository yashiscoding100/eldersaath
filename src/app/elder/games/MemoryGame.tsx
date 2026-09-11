"use client"

import { useState, useEffect } from "react"

const EMOJIS = ["🐶", "🐱", "🦊", "🐻", "🐼", "🐨", "🐸", "🐷"]

export default function MemoryGame() {
  const [cards, setCards] = useState<{ id: number, emoji: string, isFlipped: boolean, isMatched: boolean }[]>([])
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [isWon, setIsWon] = useState(false)

  const initializeGame = () => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({
        id: idx,
        emoji,
        isFlipped: false,
        isMatched: false
      }))
    setCards(shuffled)
    setFlippedIndexes([])
    setMoves(0)
    setIsWon(false)
  }

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    if (flippedIndexes.length === 2) {
      const match = cards[flippedIndexes[0]].emoji === cards[flippedIndexes[1]].emoji
      
      if (match) {
        const newCards = [...cards]
        newCards[flippedIndexes[0]].isMatched = true
        newCards[flippedIndexes[1]].isMatched = true
        setCards(newCards)
        setFlippedIndexes([])
        
        if (newCards.every(c => c.isMatched)) {
          setIsWon(true)
        }
      } else {
        setTimeout(() => {
          const newCards = [...cards]
          newCards[flippedIndexes[0]].isFlipped = false
          newCards[flippedIndexes[1]].isFlipped = false
          setCards(newCards)
          setFlippedIndexes([])
        }, 1000)
      }
    }
  }, [flippedIndexes, cards])

  const handleCardClick = (index: number) => {
    if (flippedIndexes.length === 2) return // Prevent clicking more than 2
    if (cards[index].isFlipped || cards[index].isMatched) return // Already flipped

    const newCards = [...cards]
    newCards[index].isFlipped = true
    setCards(newCards)
    setFlippedIndexes([...flippedIndexes, index])
    
    if (flippedIndexes.length === 1) {
      setMoves(m => m + 1)
    }
  }

  if (isWon) {
    return (
      <div className="bg-white p-8 rounded-3xl text-center shadow-lg w-full max-w-md animate-bounce">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-black text-green-600 mb-2">You Won!</h2>
        <p className="text-xl text-gray-600 mb-6">It took you {moves} moves.</p>
        <button 
          onClick={initializeGame}
          className="w-full bg-purple-600 text-white font-bold text-2xl py-4 rounded-2xl hover:bg-purple-700"
        >
          Play Again
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between items-center mb-4 px-2">
        <p className="text-xl font-bold text-gray-700">Moves: {moves}</p>
        <button onClick={initializeGame} className="text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-xl">Restart</button>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, i) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(i)}
            className={`aspect-square text-4xl rounded-2xl flex items-center justify-center transition-all transform ${
              card.isFlipped || card.isMatched 
                ? 'bg-white shadow-md scale-100' 
                : 'bg-purple-500 shadow-sm scale-95 hover:scale-100'
            }`}
          >
            {card.isFlipped || card.isMatched ? card.emoji : '❓'}
          </button>
        ))}
      </div>
    </div>
  )
}
