'use client'

import type { Locale } from '@/lib/i18n'
import { ui } from '@/lib/i18n'
import { getTagColor, getTagLabel } from '@/lib/tags'

export interface WineData {
  success: boolean
  nom?: string
  domaine?: string
  millesime?: string
  appellation?: string
  style?: string
  cepages?: { nom: string; pourcentage?: number }[]
  notes_aromatiques?: { famille: string; notes: string[] }[]
  terroir?: string
  erreur?: string
}

interface WineCardProps {
  data: WineData
  onReset: () => void
  onRetry?: () => void
  onBack?: () => void
  resetLabel?: string
  locale: Locale
}

export default function WineCard({ data, onReset, onRetry, onBack, resetLabel, locale }: WineCardProps) {
  const copy = ui[locale]

  if (!data.success || !data.cepages?.length) {
    return (
      <div className="flex flex-col items-center gap-6 max-w-xs w-full text-center px-2">
        <WineGlassIcon muted />
        <div className="flex flex-col gap-2">
          <p className="italic text-xl leading-snug" style={{ color: 'var(--color-bordeaux)', fontFamily: 'var(--font-playfair)' }}>
            {data.erreur ?? copy.error.wineUnknown}
          </p>
          <p className="text-sm" style={{ color: 'var(--color-brown)', opacity: 0.5 }}>
            {copy.error.wineHelp}
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          {onRetry && <PrimaryButton label={copy.actions.retry} onClick={onRetry} />}
          <TextLink label={copy.actions.back} onClick={onBack ?? onReset} />
        </div>
      </div>
    )
  }

  const { nom, domaine, millesime, appellation, style, cepages, notes_aromatiques, terroir } = data
  const hasMetaLine = millesime || appellation
  const actionLabel = resetLabel ?? (onBack ? copy.actions.backToList : copy.actions.scanAnotherBottle)
  const actionHandler = onBack ?? onReset

  return (
    <div className="flex flex-col gap-5 max-w-xs w-full px-2 pb-6">

      <div className="flex flex-col items-center gap-1 text-center">
        <h1
          className="italic leading-tight"
          style={{
            color: 'var(--color-bordeaux)',
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(1.6rem, 7vw, 2.2rem)',
          }}
        >
          {nom}
        </h1>
        {domaine && (
          <p className="text-sm tracking-wide" style={{ color: 'var(--color-brown)', opacity: 0.55 }}>
            {domaine}
          </p>
        )}
      </div>

      {(hasMetaLine || style) && (
        <div className="flex flex-col items-center gap-2">
          {hasMetaLine && (
            <div className="flex items-center justify-center gap-3">
              {millesime && (
                <span className="text-xs tracking-[0.15em] uppercase" style={{ color: 'var(--color-brown)', opacity: 0.5 }}>
                  {millesime}
                </span>
              )}
              {millesime && appellation && <MetaDot />}
              {appellation && (
                <span className="text-xs tracking-[0.15em] uppercase" style={{ color: 'var(--color-brown)', opacity: 0.5 }}>
                  {appellation}
                </span>
              )}
            </div>
          )}
          {style && <StyleBadge tag={style} locale={locale} />}
        </div>
      )}

      <Ornament />

      <Section label={copy.result.grapeVarieties}>
        {cepages!.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2"
            style={{ borderBottom: i < cepages!.length - 1 ? '1px solid rgba(107, 45, 62, 0.1)' : undefined }}
          >
            <span className="italic text-sm leading-relaxed" style={{ color: 'var(--color-bordeaux)', fontFamily: 'var(--font-playfair)' }}>
              {c.nom}
            </span>
            {c.pourcentage !== undefined && (
              <span className="text-sm tabular-nums" style={{ color: 'var(--color-brown)', opacity: 0.45 }}>
                {c.pourcentage} %
              </span>
            )}
          </div>
        ))}
      </Section>

      {notes_aromatiques && notes_aromatiques.length > 0 && (
        <>
          <Ornament />
          <Section label={copy.result.aromaticNotes}>
            <div className="flex flex-col gap-3 pt-1">
              {notes_aromatiques.map((f, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <p className="text-xs tracking-[0.15em] uppercase" style={{ color: 'var(--color-brown)', opacity: 0.38 }}>
                    {f.famille}
                  </p>
                  <p className="italic text-sm leading-relaxed" style={{ color: 'var(--color-bordeaux)', fontFamily: 'var(--font-playfair)' }}>
                    {f.notes.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </>
      )}

      {terroir && (
        <>
          <Ornament />
          <Section label={copy.result.terroir}>
            <p className="italic text-sm leading-relaxed pt-1" style={{ color: 'var(--color-bordeaux)', fontFamily: 'var(--font-playfair)' }}>
              {terroir}
            </p>
          </Section>
        </>
      )}

      <div className="pt-1">
        <OutlineButton label={actionLabel} onClick={actionHandler} />
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="italic text-xs tracking-[0.2em] uppercase mb-1" style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-playfair)' }}>
        {label}
      </p>
      {children}
    </div>
  )
}

function MetaDot() {
  return <span style={{ color: 'var(--color-gold)', fontSize: '8px' }}>✦</span>
}

function StyleBadge({ tag, locale }: { tag: string; locale: Locale }) {
  const color = getTagColor(tag)
  return (
    <span
      className="rounded-full px-2.5 py-0.5"
      style={{ border: `1px solid ${color}`, color, opacity: 0.75, fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.1em' }}
    >
      {getTagLabel(tag, locale)}
    </span>
  )
}

function Ornament() {
  return (
    <div className="w-full flex items-center gap-3">
      <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-bordeaux)', opacity: 0.1 }} />
      <span style={{ color: 'var(--color-gold)', fontSize: '10px', letterSpacing: '0.3em' }}>✦</span>
      <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-bordeaux)', opacity: 0.1 }} />
    </div>
  )
}

function PrimaryButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-full py-4 px-8 text-xs tracking-[0.2em] uppercase transition-all duration-200 active:scale-95 cursor-pointer"
      style={{ backgroundColor: 'var(--color-bordeaux)', color: 'var(--color-cream)', fontFamily: 'var(--font-inter)', border: 'none' }}
    >
      {label}
    </button>
  )
}

function OutlineButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-full py-4 px-8 text-xs tracking-[0.2em] uppercase transition-all duration-200 active:scale-95 cursor-pointer"
      style={{ border: '1px solid var(--color-bordeaux)', color: 'var(--color-bordeaux)', backgroundColor: 'transparent', fontFamily: 'var(--font-inter)' }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-bordeaux)'; e.currentTarget.style.color = 'var(--color-cream)' }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-bordeaux)' }}
    >
      {label}
    </button>
  )
}

function TextLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-xs cursor-pointer bg-transparent border-none"
      style={{ color: 'var(--color-brown)', opacity: 0.4, fontFamily: 'var(--font-inter)' }}
    >
      {label}
    </button>
  )
}

function WineGlassIcon({ muted }: { muted?: boolean }) {
  return (
    <svg width="36" height="52" viewBox="0 0 36 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--color-bordeaux)', opacity: muted ? 0.3 : 1 }}>
      <path d="M6 3h24L24 21c-1.2 5-3.5 8-6 8.5V44M12 44h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 12c2.5 7 8 11 10.5 11s8-4 10.5-11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.35" />
    </svg>
  )
}
