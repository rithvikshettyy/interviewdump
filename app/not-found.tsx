import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="bg-bg min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-mono text-indigo font-bold">404</h1>
      <p className="text-text-muted mt-2 text-lg">Page not found</p>
      <Link href="/" className="text-indigo text-sm mt-6 hover:underline">
        &larr; Go Home
      </Link>
    </div>
  )
}
