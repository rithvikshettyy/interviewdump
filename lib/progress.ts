import { createClient } from '@/lib/supabase/client'

export async function toggleProgress(
  itemId: string, 
  itemType: string, 
  status: 'solved' | 'revision' | 'done'
): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: existing } = await supabase
    .from('user_progress')
    .select()
    .eq('user_id', user.id)
    .eq('item_id', itemId)
    .eq('item_type', itemType)
    .eq('status', status)
    .single()

  if (existing) {
    await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('item_id', itemId)
      .eq('status', status)
    return false
  } else {
    await supabase
      .from('user_progress')
      .insert({ user_id: user.id, item_id: itemId, item_type: itemType, status })
    return true
  }
}

export async function getProgressIds(
  itemType: string, 
  status: string
): Promise<string[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('user_progress')
    .select('item_id')
    .eq('user_id', user.id)
    .eq('item_type', itemType)
    .eq('status', status)

  return data?.map(d => d.item_id) ?? []
}

export async function getStats(): Promise<{
  solved: number
  revision: number
  done: number
}> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { solved: 0, revision: 0, done: 0 }

  const { data } = await supabase
    .from('user_progress')
    .select('status')
    .eq('user_id', user.id)

  const solved = data?.filter(d => d.status === 'solved').length ?? 0
  const revision = data?.filter(d => d.status === 'revision').length ?? 0
  const done = data?.filter(d => d.status === 'done').length ?? 0

  return { solved, revision, done }
}

export async function getStatsByType(): Promise<Record<string, { solved: number; revision: number }>> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return {}

  const { data } = await supabase
    .from('user_progress')
    .select('item_type, status')
    .eq('user_id', user.id)

  if (!data) return {}

  const result: Record<string, { solved: number; revision: number }> = {}
  for (const row of data) {
    if (!result[row.item_type]) result[row.item_type] = { solved: 0, revision: 0 }
    if (row.status === 'solved') result[row.item_type].solved++
    if (row.status === 'revision') result[row.item_type].revision++
  }
  return result
}
