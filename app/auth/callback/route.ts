import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    // Build a preliminary redirect response so we can attach cookies to it
    const response = NextResponse.redirect(`${origin}/introduction`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Set on both request (for subsequent reads) and response (sent to browser)
              request.cookies.set(name, value)
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if user has completed onboarding
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (!profile?.role) {
          // New user — redirect to onboarding, preserving the session cookies
          const onboardingResponse = NextResponse.redirect(`${origin}/onboarding`)
          response.cookies.getAll().forEach(({ name, value, ...options }) => {
            onboardingResponse.cookies.set(name, value, options)
          })
          return onboardingResponse
        }
      }

      return response
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
