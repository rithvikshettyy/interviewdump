export const BRAND_WORDMARK = {
  first: 'Interview',
  second: 'Dump',
} as const

export const BRAND_DOCUMENT_TITLE = `${BRAND_WORDMARK.first} ${BRAND_WORDMARK.second}`

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl'
  }

  return (
    <span className={`font-mono ${sizeClasses[size]} text-text tracking-tight`}>
      <span className="font-normal">{BRAND_WORDMARK.first}</span>
      <span className="font-extrabold">{BRAND_WORDMARK.second}</span>
    </span>
  )
}
