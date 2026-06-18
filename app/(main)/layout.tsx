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
      <main className="ml-0 md:ml-[240px] w-full md:w-[calc(100%-240px)] min-h-screen pt-14 md:pt-0">
        {children}
      </main>
    </div>
  )
}
