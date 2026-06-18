'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-mono text-indigo font-bold">Oops</h1>
      <p className="text-text-muted mt-3 text-base">Something went wrong.</p>
      <p className="text-text-dim text-sm mt-1 max-w-sm">
        An error occurred during authentication. Please try again.
      </p>
      <div className="flex gap-3 mt-6">
        <button
          onClick={reset}
          className="bg-indigo text-white text-sm font-semibold rounded-xl px-5 py-2.5 hover:bg-indigo/90 transition-colors cursor-pointer focus:outline-none"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-border text-text-muted text-sm font-semibold rounded-xl px-5 py-2.5 hover:border-border-hover hover:text-text transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
