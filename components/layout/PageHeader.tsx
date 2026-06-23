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
      <div className="px-4 sm:px-6 pt-6 pb-4 flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-text font-sans truncate">{title}</h1>
          <p className="text-sm text-text-muted mt-1 line-clamp-2">{subtitle}</p>
        </div>

        {/* Top-Right Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* GitHub Button */}
          <a
            href="https://github.com/rithvikshettyy/interviewdump"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Star on GitHub (opens in new tab)"
            className="flex items-center gap-1.5 border border-border text-text-muted text-xs rounded-lg px-2.5 py-1.5 hover:border-border-hover hover:text-text transition font-medium bg-bg/40 hover:bg-surface-hover"
          >
            <svg aria-hidden="true" className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <span className="hidden sm:inline">Star on GitHub</span>
          </a>

          {/* X Button */}
          <a
            href="https://x.com/RithvikShetty04"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow on X (opens in new tab)"
            className="flex items-center gap-1.5 border border-border text-text-muted text-xs rounded-lg px-2.5 py-1.5 hover:border-border-hover hover:text-text transition font-medium bg-bg/40 hover:bg-surface-hover"
          >
            <svg aria-hidden="true" className="w-3 h-3 fill-current flex-shrink-0" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="hidden sm:inline">Follow on X</span>
          </a>
        </div>
      </div>

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div 
          role="tablist"
          aria-label="Page sub-sections"
          className="flex gap-0 overflow-x-auto scrollbar-hide px-4 sm:px-6 border-t border-border/40"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value
            return (
              <button
                key={tab.value}
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange?.(tab.value)}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 whitespace-nowrap border-b-2 focus:outline-none ${
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
