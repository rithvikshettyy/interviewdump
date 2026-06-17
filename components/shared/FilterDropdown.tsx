import React from 'react'
import { ChevronDown } from 'lucide-react'

interface FilterDropdownProps {
  label: string
  options: string[]
  value: string
  onChange: (val: string) => void
}

export default function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
  return (
    <div className="relative min-w-[160px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-surface border border-border rounded-xl px-4 py-2.5 pr-10 text-sm text-text hover:border-border-hover focus:border-indigo focus:outline-none cursor-pointer transition-colors duration-150"
      >
        <option value="" className="bg-surface text-text-muted">
          {label}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-surface text-text">
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none" />
    </div>
  )
}
