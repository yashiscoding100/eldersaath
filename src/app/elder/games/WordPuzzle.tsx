"use client"

import { useState, useEffect } from "react"

const WORDS = [
  { word: "FAMILY", hint: "People who love you" },
  { word: "HEALTH", hint: "Wellness and feeling good" },
  { word: "MORNING", hint: "The start of the day" },
  { word: "DOCTOR", hint: "A medical professional" },
  { word: "GARDEN", hint: "Where flowers grow" },
  { word: "WATER", hint: "Essential to drink daily" }
]

export default function WordPuzzle() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scrambled, setScrambled] = useState<string[]>([])
  const [guess, setGuess] = useState<string[]>([])
  const [isWon, setIsWon] = useState(false)

  const setupWord = (index: number) => {
    const word = WORDS[index].word
    let scrambledArray = word.split("")
    // Simple shuffle
    for (let i = scrambledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scrambledArray[i], scrambledArray[j]] = [scrambledArray[j], scrambledArray[i]]
    }
    // Prevent it from being identical to the original word
    if (scrambledArray.join("") === word) {
      scrambledArray.reverse()
    }
    setScrambled(scrambledArray)
    setGuess([])
    setIsWon(false)
  }

  useEffect(() => {
    setupWord(0)
  }, [])

  const handleLetterClick = (letter: string, index: number) => {
    setGuess([...guess, letter])
    const newScrambled = [...scrambled]
    newScrambled[index] = "" // Mark as used
    setScrambled(newScrambled)
  }

  const handleUndo = () => {
    if (guess.length === 0) return
    const lastLetter = guess[guess.length - 1]
    
    // Find the first empty spot in scrambled to return the letter
    const newScrambled = [...scrambled]
    const emptyIndex = newScrambled.indexOf("")
    if (emptyIndex !== -1) {
      newScrambled[emptyIndex] = lastLetter
    }
    
    setScrambled(newScrambled)
    setGuess(guess.slice(0, -1))
  }

  useEffect(() => {
    if (guess.length > 0 && guess.length === WORDS[currentIndex].word.length) {
      if (guess.join("") === WORDS[currentIndex].word) {
        setIsWon(true)
      } else {
        // Incorrect guess, reset
        setTimeout(() => {
          setupWord(currentIndex)
        }, 1000)
      }
    }
  }, [guess, currentIndex])

  const handleNext = () => {
    const next = (currentIndex + 1) % WORDS.length
    setCurrentIndex(next)
    setupWord(next)
  }

  if (isWon) {
    return (
      <div className="bg-white p-8 rounded-3xl text-center shadow-lg w-full max-w-md animate-bounce border-2 border-green-200">
        <div className="text-6xl mb-4">🌟</div>
        <h2 className="text-3xl font-black text-green-600 mb-2">Correct!</h2>
        <p className="text-xl text-gray-600 mb-6">The word was {WORDS[currentIndex].word}</p>
        <button onClick={handleNext} className="w-full bg-blue-600 text-white font-bold text-2xl py-4 rounded-2xl hover:bg-blue-700">
          Next Word ➡️
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-sm border border-blue-100">
      <div className="text-center mb-6">
        <h2 className="text-gray-500 font-bold mb-1">Hint:</h2>
        <p className="text-2xl font-bold text-blue-900">{WORDS[currentIndex].hint}</p>
      </div>

      {/* Answer Boxes */}
      <div className="flex justify-center gap-2 mb-8">
        {Array.from({ length: WORDS[currentIndex].word.length }).map((_, i) => (
          <div key={i} className="w-12 h-14 border-b-4 border-gray-300 flex items-center justify-center text-3xl font-black text-green-700">
            {guess[i] || ""}
          </div>
        ))}
      </div>

      {/* Scrambled Letters */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {scrambled.map((letter, i) => (
          <button
            key={i}
            disabled={!letter}
            onClick={() => handleLetterClick(letter, i)}
            className={`w-14 h-14 rounded-xl text-3xl font-black shadow-sm transition-all ${
              letter ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-2 border-blue-300' : 'bg-gray-100 opacity-50'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button onClick={handleUndo} disabled={guess.length === 0} className="text-gray-500 font-bold px-6 py-3 bg-gray-100 rounded-xl disabled:opacity-50">
          ↩️ Undo Letter
        </button>
      </div>
    </div>
  )
}
