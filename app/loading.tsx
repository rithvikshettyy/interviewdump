export default function Loading() {
  return (
    <div 
      role="status"
      aria-live="polite"
      className="bg-bg min-h-screen flex flex-col items-center justify-center"
    >
      <div className="flex space-x-2" aria-hidden="true">
        <div className="w-3 h-3 bg-indigo rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-3 h-3 bg-indigo rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
        <div className="w-3 h-3 bg-indigo rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
      </div>
      <p className="text-text-muted text-sm font-mono mt-4">Loading...</p>
    </div>
  )
}
