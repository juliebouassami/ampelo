'use client'

export interface WineData {
  success: boolean
  nom?: string
  domaine?: string
  millesime?: string
  appellation?: string
  cepages?: { nom: string; pourcentage?: number }[]
  erreur?: string
}

interface WineCardProps {
  data: WineData
  onReset: () => void
}

export default function WineCard({ data, onReset }: WineCardProps) {
  if (!data.success || !data.cepages?.length) {
    return (
      <div className="flex flex-col items-center gap-8 max-w-xs w-full text-center px-2">
        <WineGlassIcon muted />
        <div className="flex flex-col gap-3">
          <p
            className="italic text-xl leading-snug"
            style={{ color: 'var(--color-bordeaux)', fontFamily: 'var(--font-playfair)' }}
          >
            {data.erreur ?? 'Vin non identifié.'}
          </p>
          <p className="text-sm" style={{ color: 'var(--color-brown)', opacity: 0.5 }}>
            Essayez avec une photo plus nette, de face, bien éclairée.
          </p>
        </div>
        <ResetButton onClick={onReset} />
      </div>
    )
  }

  const { nom, domaine, millesime, appellation, cepages } = data
  const hasMeta = millesime || appellation

  return (
    <div className="flex flex-col gap-8 max-w-xs w-full px-2">

      {/* Header — nom du vin */}
      <div className="flex flex-col gap-1 text-center">
        <h1
          className="italic leading-tight"
          style={{
            color: 'var(--color-bordeaux)',
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(1.8rem, 8vw, 2.4rem)',
          }}
        >
          {nom}
        </h1>
        {domaine && (
          <p
            className="text-sm tracking-wide"
            style={{ color: 'var(--color-brown)', opacity: 0.55 }}
          >
            {domaine}
          </p>
        )}
      </div>

      {/* Meta — millésime + appellation */}
      {hasMeta && (
        <div
          className="flex justify-center gap-6 text-xs tracking-[0.15em] uppercase"
          style={{ color: 'var(--color-brown)', opacity: 0.5 }}
        >
          {millesime && (
            <div className="flex flex-col items-center gap-1">
              <span style={{ color: 'var(--color-gold)', opacity: 1 }}>✦</span>
              <span>{millesime}</span>
            </div>
          )}
          {millesime && appellation && (
            <div
              className="w-px self-stretch"
              style={{ backgroundColor: 'var(--color-bordeaux)', opacity: 0.15 }}
            />
          )}
          {appellation && (
            <div className="flex flex-col items-center gap-1">
              <span style={{ color: 'var(--color-gold)', opacity: 1 }}>✦</span>
              <span>{appellation}</span>
            </div>
          )}
        </div>
      )}

      {/* Ornament */}
      <div className="w-full flex items-center gap-3">
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-bordeaux)', opacity: 0.15 }} />
        <span style={{ color: 'var(--color-gold)', fontSize: '10px', letterSpacing: '0.3em' }}>✦</span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-bordeaux)', opacity: 0.15 }} />
      </div>

      {/* Cépages — star of the show */}
      <div className="flex flex-col gap-1">
        <p
          className="italic text-xs tracking-[0.2em] uppercase mb-3"
          style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-playfair)' }}
        >
          Cépages
        </p>
        {cepages.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3"
            style={{
              borderBottom: i < cepages.length - 1
                ? `1px solid rgba(107, 45, 62, 0.1)`
                : undefined,
            }}
          >
            <span
              className="italic text-lg"
              style={{ color: 'var(--color-bordeaux)', fontFamily: 'var(--font-playfair)' }}
            >
              {c.nom}
            </span>
            {c.pourcentage !== undefined && (
              <span
                className="text-sm tabular-nums"
                style={{ color: 'var(--color-brown)', opacity: 0.45 }}
              >
                {c.pourcentage} %
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Reset */}
      <div className="pt-2">
        <ResetButton onClick={onReset} />
      </div>
    </div>
  )
}

function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-full py-4 px-8 text-xs tracking-[0.2em] uppercase transition-all duration-200 active:scale-95 cursor-pointer"
      style={{
        border: '1px solid var(--color-bordeaux)',
        color: 'var(--color-bordeaux)',
        backgroundColor: 'transparent',
        fontFamily: 'var(--font-inter)',
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
      Scanner une autre bouteille
    </button>
  )
}

function WineGlassIcon({ muted }: { muted?: boolean }) {
  return (
    <svg
      width="36"
      height="52"
      viewBox="0 0 36 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: 'var(--color-bordeaux)', opacity: muted ? 0.3 : 1 }}
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
