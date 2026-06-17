import React from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  placeholder: string
  value: string
  onChange: (val: string) => void
}

export default function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
  return (
    <div className="bg-surface border border-border rounded-xl px-4 py-2.5 w-full max-w-sm flex items-center gap-2 focus-within:border-indigo transition duration-150">
      <Search className="text-text-dim w-4 h-4 flex-shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm text-text placeholder-text-dim outline-none flex-1"
      />
    </div>
  )
}
