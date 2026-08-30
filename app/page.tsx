'use client'

import { useRef, useState } from 'react'
import Scanner from '@/components/Scanner'
import WineCard, { type WineData } from '@/components/WineCard'
import WineList, { type CarteData, type WineListItem } from '@/components/WineList'

export type ScanMode = 'bouteille' | 'carte'

type View = 'scan' | 'loading' | 'result-bouteille' | 'result-carte' | 'result-carte-detail'

async function resizeAndEncode(file: File): Promise<{ base64: string; mimeType: string }> {
  const MAX = 1400
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) { reject(new Error('resize failed')); return }
      const reader = new FileReader()
      reader.onload = () => resolve({
        base64: (reader.result as string).split(',')[1],
        mimeType: 'image/jpeg',
      })
      reader.onerror = reject
      reader.readAsDataURL(blob)
    }, 'image/jpeg', 0.92)
  })
}

export default function Home() {
  const [view, setView] = useState<View>('scan')
  const [wineData, setWineData] = useState<WineData | null>(null)
  const [carteData, setCarteData] = useState<CarteData | null>(null)
  const [lastMode, setLastMode] = useState<ScanMode>('bouteille')

  const bouteilleRef = useRef<HTMLInputElement>(null)
  const carteRef = useRef<HTMLInputElement>(null)

  const openCapture = (mode: ScanMode) => {
    setLastMode(mode)
    if (mode === 'bouteille') bouteilleRef.current?.click()
    else carteRef.current?.click()
  }

  const handleCapture = async (file: File, mode: ScanMode) => {
    setLastMode(mode)
    setView('loading')

    try {
      const { base64, mimeType } = await resizeAndEncode(file)
      const endpoint = mode === 'bouteille' ? '/api/analyze' : '/api/scan-carte'

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType }),
      })

      const data = await res.json()

      if (mode === 'bouteille') {
        setWineData(data as WineData)
        setView('result-bouteille')
      } else {
        setCarteData(data as CarteData)
        setView('result-carte')
      }
    } catch {
      if (mode === 'bouteille') {
        setWineData({ success: false, erreur: 'Erreur de connexion. Réessayez.' })
        setView('result-bouteille')
      } else {
        setCarteData({ success: false, erreur: 'Erreur de connexion. Réessayez.' })
        setView('result-carte')
      }
    }
  }

  const handleSelectWine = async (vin: WineListItem) => {
    setView('loading')
    try {
      const res = await fetch('/api/wine-detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: vin.nom, millesime: vin.millesime, cepages: vin.cepages }),
      })
      const data = await res.json()
      setWineData(data as WineData)
      setView('result-carte-detail')
    } catch {
      setWineData({ success: false, erreur: 'Erreur de connexion. Réessayez.' })
      setView('result-carte-detail')
    }
  }

  const handleReset = () => {
    setView('scan')
    setWineData(null)
    setCarteData(null)
  }

  const handleBackToCarte = () => {
    setView('result-carte')
    setWineData(null)
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      {/* Hidden file inputs — always mounted for retry */}
      <input
        ref={bouteilleRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={e => {
          const f = e.target.files?.[0]
          if (f) handleCapture(f, 'bouteille')
          e.target.value = ''
        }}
        className="hidden"
      />
      <input
        ref={carteRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={e => {
          const f = e.target.files?.[0]
          if (f) handleCapture(f, 'carte')
          e.target.value = ''
        }}
        className="hidden"
      />

      {view === 'scan' && (
        <Scanner
          onOpenBouteille={() => openCapture('bouteille')}
          onOpenCarte={() => openCapture('carte')}
        />
      )}

      {view === 'loading' && <LoadingState />}

      {view === 'result-bouteille' && wineData && (
        <WineCard
          data={wineData}
          onReset={handleReset}
          onRetry={() => openCapture('bouteille')}
        />
      )}

      {view === 'result-carte' && carteData && (
        <WineList
          data={carteData}
          onReset={handleReset}
          onRetry={() => openCapture('carte')}
          onSelectWine={handleSelectWine}
        />
      )}

      {view === 'result-carte-detail' && wineData && (
        <WineCard
          data={wineData}
          onReset={handleReset}
          onRetry={() => openCapture('carte')}
          onBack={handleBackToCarte}
        />
      )}
    </main>
  )
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-7">
      <WineGlassLoader />
      <p
        className="italic text-lg"
        style={{ color: 'var(--color-bordeaux)', fontFamily: 'var(--font-playfair)' }}
      >
        Consultation de la cave…
      </p>
    </div>
  )
}

function WineGlassLoader() {
  return (
    <svg
      width="44"
      height="64"
      viewBox="0 0 36 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin"
      style={{ color: 'var(--color-bordeaux)' }}
      aria-hidden="true"
    >
      <path d="M6 3h24L24 21c-1.2 5-3.5 8-6 8.5V44M12 44h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 12c2.5 7 8 11 10.5 11s8-4 10.5-11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.35" />
    </svg>
  )
}
