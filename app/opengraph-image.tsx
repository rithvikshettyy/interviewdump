import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'InterviewDump - Free Tech Interview Prep'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0d0d14',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 90px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glow accent */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
          <span style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
            Interview<span style={{ fontWeight: 300 }}>Dump</span>
          </span>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', marginLeft: '4px' }} />
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.1,
            letterSpacing: '-1.5px',
            marginBottom: '24px',
            maxWidth: '800px',
          }}
        >
          Free Tech Interview Prep.
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: '26px',
            color: '#888899',
            lineHeight: 1.5,
            maxWidth: '680px',
            marginBottom: '40px',
          }}
        >
          500+ questions. 24+ companies. DSA, system design, SQL, aptitude and more.
        </div>

        {/* CTA Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#6366f1',
            borderRadius: '12px',
            padding: '14px 32px',
            fontSize: '20px',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '32px',
          }}
        >
          Start Prepping — It&#39;s Free →
        </div>

        {/* Pill badges */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {['No Paywall', '500+ Questions', '24+ Companies'].map((tag) => (
            <div
              key={tag}
              style={{
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '100px',
                padding: '8px 20px',
                color: '#a5b4fc',
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: '90px',
            fontSize: '18px',
            color: '#444455',
            fontFamily: 'monospace',
          }}
        >
          interviewdump.dev
        </div>
      </div>
    ),
    { ...size }
  )
}
