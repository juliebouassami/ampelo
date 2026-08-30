'use client'

interface ScannerProps {
  onOpenBouteille: () => void
  onOpenCarte: () => void
}

export default function Scanner({ onOpenBouteille, onOpenCarte }: ScannerProps) {
  return (
    <div className="flex flex-col items-center gap-12 max-w-xs w-full text-center px-2">

      <div className="flex flex-col items-center gap-5">
        <WineGlassIcon />
        <div className="flex flex-col items-center gap-3">
          <h1
            className="italic text-6xl leading-none tracking-tight"
            style={{ color: 'var(--color-bordeaux)', fontFamily: 'var(--font-playfair)' }}
          >
            Ampélo
          </h1>
          <div className="flex flex-col gap-1.5" style={{ color: 'var(--color-brown)', opacity: 0.55 }}>
            <p className="text-sm leading-relaxed">
              Le cépage n&apos;est pas toujours indiqué, et pourtant c&apos;est lui qui guide les arômes.
            </p>
            <p className="text-sm leading-relaxed">
              Scannez une bouteille ou une carte des vins pour en savoir plus.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full flex items-center gap-3">
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-bordeaux)', opacity: 0.15 }} />
        <span style={{ color: 'var(--color-gold)', fontSize: '10px', letterSpacing: '0.3em' }}>✦</span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-bordeaux)', opacity: 0.15 }} />
      </div>

      <div className="flex flex-col items-center gap-3 w-full">
        <button
          onClick={onOpenBouteille}
          className="w-full rounded-full py-5 px-6 transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer"
          style={{
            backgroundColor: 'var(--color-bordeaux)',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-inter)',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-bordeaux-dark)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-bordeaux)')}
        >
          <span className="flex items-center gap-2 whitespace-nowrap" style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            <CameraIcon />
            Scanner une bouteille
          </span>
          <span style={{ fontSize: '10px', opacity: 0.6, letterSpacing: '0.04em' }}>
            étiquette recto ou verso
          </span>
        </button>

        <button
          onClick={onOpenCarte}
          className="w-full rounded-full py-5 px-6 whitespace-nowrap transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          style={{
            border: '1px solid var(--color-bordeaux)',
            color: 'var(--color-bordeaux)',
            backgroundColor: 'transparent',
            fontFamily: 'var(--font-inter)',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--color-bordeaux)'
            e.currentTarget.style.color = 'var(--color-cream)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--color-bordeaux)'
          }}
        >
          <MenuIcon />
          Scanner une carte des vins
        </button>
      </div>
    </div>
  )
}

function WineGlassIcon() {
  return (
    <svg width="36" height="52" viewBox="0 0 36 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--color-bordeaux)' }}>
      <path d="M6 3h24L24 21c-1.2 5-3.5 8-6 8.5V44M12 44h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 12c2.5 7 8 11 10.5 11s8-4 10.5-11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.35" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  )
}
