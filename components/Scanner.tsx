'use client'

import { useRef } from 'react'

interface ScannerProps {
  onCapture: (file: File) => void
}

export default function Scanner({ onCapture }: ScannerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onCapture(file)
  }

  return (
    <div className="flex flex-col items-center gap-12 max-w-xs w-full text-center px-2">

      {/* Logo */}
      <div className="flex flex-col items-center gap-5">
        <WineGlassIcon />
        <div className="flex flex-col items-center gap-2">
          <h1
            className="italic text-6xl leading-none tracking-tight"
            style={{ color: 'var(--color-bordeaux)', fontFamily: 'var(--font-playfair)' }}
          >
            Ampélo
          </h1>
          <p
            className="text-xs tracking-[0.18em] uppercase leading-relaxed"
            style={{ color: 'var(--color-brown)', opacity: 0.45 }}
          >
            Découvrez les cépages de n'importe quel vin
          </p>
        </div>
      </div>

      {/* Ornament */}
      <div className="w-full flex items-center gap-3">
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-bordeaux)', opacity: 0.15 }} />
        <span style={{ color: 'var(--color-gold)', fontSize: '10px', letterSpacing: '0.3em' }}>✦</span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-bordeaux)', opacity: 0.15 }} />
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4 w-full">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          className="hidden"
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-full py-5 px-8 text-xs tracking-[0.2em] uppercase transition-all duration-200 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
          style={{
            backgroundColor: 'var(--color-bordeaux)',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-inter)',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-bordeaux-dark)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-bordeaux)')}
        >
          <CameraIcon />
          Scanner une bouteille
        </button>

        <p className="text-xs" style={{ color: 'var(--color-brown)', opacity: 0.38 }}>
          Photo de l'étiquette · recto ou verso
        </p>
      </div>
    </div>
  )
}

function WineGlassIcon() {
  return (
    <svg
      width="36"
      height="52"
      viewBox="0 0 36 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: 'var(--color-bordeaux)' }}
    >
      <path
        d="M6 3h24L24 21c-1.2 5-3.5 8-6 8.5V44M12 44h12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 12c2.5 7 8 11 10.5 11s8-4 10.5-11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}
