'use client'
import { useState, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

interface Props {
  text: string
}

export default function ReadAloudButton({ text }: Props) {
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    return () => { window.speechSynthesis?.cancel() }
  }, [])

  const toggle = () => {
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    } else {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.92
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)
      window.speechSynthesis.speak(utterance)
      setSpeaking(true)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={speaking ? 'Stop reading' : 'Read aloud'}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-colors cursor-pointer ${
        speaking
          ? 'bg-indigo-dim border-indigo/40 text-indigo'
          : 'bg-bg border-border text-text-dim hover:border-indigo/40 hover:text-text'
      }`}
    >
      {speaking ? (
        <><VolumeX className="w-3.5 h-3.5" /><span>Stop</span></>
      ) : (
        <><Volume2 className="w-3.5 h-3.5" /><span>Read</span></>
      )}
    </button>
  )
}
