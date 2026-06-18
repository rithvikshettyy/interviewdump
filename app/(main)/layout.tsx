import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <main className="ml-[240px] w-[calc(100%-240px)] min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
