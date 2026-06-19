import { createClient } from '@/lib/supabase/client'

const BADGE_MILESTONES = [7, 30, 100]

async function checkAndAwardBadges(userId: string, streakCount: number) {
  const supabase = createClient()
  for (const milestone of BADGE_MILESTONES) {
    if (streakCount >= milestone) {
      await supabase
        .from('user_achievements')
        .upsert(
          { user_id: userId, achievement_id: `streak_${milestone}` },
          { onConflict: 'user_id,achievement_id', ignoreDuplicates: true }
        )
    }
  }
}

export async function updateStreak(userId: string): Promise<number> {
  const supabase = createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('streak_count, last_active_date')
    .eq('id', userId)
    .single()

  if (!profile) return 0

  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  if (profile.last_active_date === today) {
    return profile.streak_count ?? 0
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const newStreak = profile.last_active_date === yesterday
    ? (profile.streak_count ?? 0) + 1
    : 1

  await supabase
    .from('profiles')
    .update({ streak_count: newStreak, last_active_date: today })
    .eq('id', userId)

  await checkAndAwardBadges(userId, newStreak)

  return newStreak
}

export async function getStreak(userId: string): Promise<{ count: number; achievements: string[] }> {
  const supabase = createClient()

  const [profileRes, achievementsRes] = await Promise.all([
    supabase.from('profiles').select('streak_count').eq('id', userId).single(),
    supabase.from('user_achievements').select('achievement_id').eq('user_id', userId),
  ])

  return {
    count: profileRes.data?.streak_count ?? 0,
    achievements: achievementsRes.data?.map((a) => a.achievement_id) ?? [],
  }
}
