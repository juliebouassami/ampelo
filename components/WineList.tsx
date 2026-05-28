'use client'

import { useState } from 'react'
import type { StyleTag } from './WineCard'

export interface WineListItem {
  nom: string
  millesime?: string
  cepages: string
  notes: string
  style: StyleTag
}

export interface CarteData {
  success: boolean
  vins?: WineListItem[]
  erreur?: string
}

interface WineListProps {
  data: CarteData
  onReset: () => void
}

const ALL_STYLES: StyleTag[] = ['Puissant', 'Minéral', 'Fruité', 'Frais', 'Moelleux']

const STYLE_COLORS: Record<StyleTag, string> = {
  Puissant: '#6B2D3E',
  Minéral: '#3D5A6B',
  Fruité: '#7A4A2E',
  Frais: '#2E6B4A',
  Moelleux: '#6B5A2E',
}

export default function WineList({ data, onReset }: WineListProps) {
  const [activeFilter, setActiveFilter] = useState<StyleTag | null>(null)

  if (!data.success || !data.vins?.length) {
    return (
      <div className="flex flex-col items-center gap-8 max-w-xs w-full text-center px-2">
        <p
          className="italic text-xl leading-snug"
          style={{ color: 'var(--color-bordeaux)', fontFamily: 'var(--font-playfair)' }}
        >
          {data.erreur ?? 'Carte non reconnue.'}
        </p>
        <p className="text-sm" style={{ color: 'var(--color-brown)', opacity: 0.5 }}>
          Essayez avec une photo plus nette, bien éclairée, en face de la carte.
        </p>
        <ResetButton onClick={onReset} />
      </div>
    )
  }

  const filtered = activeFilter
    ? data.vins.filter(v => v.style === activeFilter)
    : data.vins

  const availableStyles = ALL_STYLES.filter(s => data.vins!.some(v => v.style === s))

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm px-2 pb-8">

      {/* Header */}
      <h1
        className="italic text-center"
        style={{ color: 'var(--color-bordeaux)', fontFamily: 'var(--font-playfair)', fontSize: '1.8rem' }}
      >
        La carte
      </h1>

      {/* Filter bar */}
      {availableStyles.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center">
          <FilterPill
            label="Tous"
            active={activeFilter === null}
            color="var(--color-bordeaux)"
            onClick={() => setActiveFilter(null)}
          />
          {availableStyles.map(s => (
            <FilterPill
              key={s}
              label={s}
              active={activeFilter === s}
              color={STYLE_COLORS[s]}
              onClick={() => setActiveFilter(activeFilter === s ? null : s)}
            />
          ))}
        </div>
      )}

      <div
        className="w-full h-px"
        style={{ backgroundColor: 'var(--color-bordeaux)', opacity: 0.12 }}
      />

      {/* Wine rows */}
      <div className="flex flex-col">
        {filtered.map((vin, i) => (
          <WineRow key={i} vin={vin} last={i === filtered.length - 1} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-center py-6" style={{ color: 'var(--color-brown)', opacity: 0.4 }}>
            Aucun vin pour ce style.
          </p>
        )}
      </div>

      <div
        className="w-full h-px"
        style={{ backgroundColor: 'var(--color-bordeaux)', opacity: 0.12 }}
      />

      <ResetButton onClick={onReset} />
    </div>
  )
}

function WineRow({ vin, last }: { vin: WineListItem; last: boolean }) {
  const color = STYLE_COLORS[vin.style] ?? 'var(--color-bordeaux)'

  return (
    <div
      className="flex flex-col gap-1 py-4"
      style={{ borderBottom: last ? undefined : '1px solid rgba(107, 45, 62, 0.08)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p
            className="italic leading-snug"
            style={{ color: 'var(--color-bordeaux)', fontFamily: 'var(--font-playfair)', fontSize: '1.1rem' }}
          >
            {vin.nom}
          </p>
          {vin.millesime && (
            <p
              className="text-xs tracking-[0.1em]"
              style={{ color: 'var(--color-brown)', opacity: 0.4 }}
            >
              {vin.millesime}
            </p>
          )}
        </div>
        <span
          className="shrink-0 rounded-full px-2 py-0.5"
          style={{
            border: `1px solid ${color}`,
            color,
            opacity: 0.8,
            fontFamily: 'var(--font-inter)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginTop: '3px',
          }}
        >
          {vin.style}
        </span>
      </div>
      <p className="text-xs tracking-wide" style={{ color: 'var(--color-brown)', opacity: 0.5 }}>
        {vin.cepages}
      </p>
      <p className="text-sm italic" style={{ color: 'var(--color-brown)', opacity: 0.65, fontFamily: 'var(--font-playfair)' }}>
        {vin.notes}
      </p>
    </div>
  )
}

function FilterPill({
  label,
  active,
  color,
  onClick,
}: {
  label: string
  active: boolean
  color: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-4 py-1.5 text-xs tracking-wider uppercase transition-all duration-150 cursor-pointer"
      style={{
        fontFamily: 'var(--font-inter)',
        backgroundColor: active ? color : 'transparent',
        color: active ? 'var(--color-cream)' : color,
        border: `1px solid ${color}`,
        opacity: active ? 1 : 0.65,
      }}
    >
      {label}
    </button>
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
      Scanner une autre carte
    </button>
  )
}
