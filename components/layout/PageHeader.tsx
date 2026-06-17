import React from 'react'

interface Tab {
  label: string
  value: string
}

interface PageHeaderProps {
  title: string
  subtitle: string
  tabs?: Tab[]
  activeTab?: string
  onTabChange?: (val: string) => void
}

export default function PageHeader({
  title,
  subtitle,
  tabs,
  activeTab,
  onTabChange,
}: PageHeaderProps) {
  return (
    <div className="border-b border-border pb-0 bg-surface">
      {/* Top Section */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-text font-sans">{title}</h1>
        <p className="text-sm text-text-muted mt-1">{subtitle}</p>
      </div>

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="flex gap-0 overflow-x-auto scrollbar-hide px-6 border-t border-border/40">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange?.(tab.value)}
                className={`px-4 py-3 text-sm cursor-pointer transition-colors duration-150 whitespace-nowrap border-b-2 focus:outline-none ${
                  isActive
                    ? 'border-indigo text-text font-semibold'
                    : 'border-transparent text-text-muted hover:text-text'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
