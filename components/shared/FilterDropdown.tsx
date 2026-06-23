'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

interface FilterDropdownProps {
  label: string
  options: string[]
  value: string
  onChange: (val: string) => void
  includeResetOption?: boolean
  className?: string
  triggerClassName?: string
  panelClassName?: string
}

export default function FilterDropdown({
  label,
  options,
  value,
  onChange,
  includeResetOption = true,
  className = '',
  triggerClassName = '',
  panelClassName = '',
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const dropdownOptions = [
    ...(includeResetOption ? [{ label, value: '' }] : []),
    ...options.map((option) => ({ label: option, value: option })),
  ]

  const selectedLabel =
    dropdownOptions.find((option) => option.value === value)?.label ?? label

  return (
    <div ref={containerRef} className={`relative min-w-[120px] sm:min-w-[160px] ${className}`}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full bg-surface border rounded-xl px-4 py-2.5 text-sm text-text flex items-center justify-between gap-2 cursor-pointer transition-colors duration-150 ${
          isOpen
            ? 'border-indigo'
            : 'border-border hover:border-border-hover'
        } ${triggerClassName}`}
      >
        <span className="truncate text-left">{selectedLabel}</span>
        <ChevronDown
          aria-hidden="true"
          className={`w-4 h-4 flex-shrink-0 text-text-dim transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={label}
          className={`absolute top-full mt-2 left-0 min-w-[max(100%,200px)] max-h-64 overflow-y-auto bg-surface border border-border rounded-xl shadow-2xl shadow-black/40 py-1.5 z-50 origin-top-left animate-fadeIn-fast ${panelClassName}`}
        >
          {dropdownOptions.map((option) => {
            const isSelected = option.value === value

            return (
              <button
                key={`${label}-${option.value || 'all'}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-[calc(100%-12px)] mx-1.5 flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-dim text-text font-medium'
                    : 'text-text-muted hover:bg-surface-hover hover:text-text'
                }`}
              >
                <span className="truncate text-left">{option.label}</span>
                {isSelected && (
                  <Check aria-hidden="true" className="w-4 h-4 flex-shrink-0 text-indigo-light" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
