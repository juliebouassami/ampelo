'use client'

import { useState } from 'react'
import Scanner, { type ScanMode } from '@/components/Scanner'
import WineCard, { type WineData } from '@/components/WineCard'
import WineList, { type CarteData } from '@/components/WineList'

type View = 'scan' | 'loading' | 'result-bouteille' | 'result-carte'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function Home() {
  const [view, setView] = useState<View>('scan')
  const [wineData, setWineData] = useState<WineData | null>(null)
  const [carteData, setCarteData] = useState<CarteData | null>(null)
  const [loadingMode, setLoadingMode] = useState<ScanMode>('bouteille')

  const handleCapture = async (file: File, mode: ScanMode) => {
    setView('loading')
    setLoadingMode(mode)

    try {
      const base64 = await fileToBase64(file)
      const endpoint = mode === 'bouteille' ? '/api/analyze' : '/api/scan-carte'

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType: file.type }),
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

  const handleReset = () => {
    setView('scan')
    setWineData(null)
    setCarteData(null)
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      {view === 'scan' && (
        <Scanner onCapture={handleCapture} />
      )}

      {view === 'loading' && (
        <LoadingState mode={loadingMode} />
      )}

      {view === 'result-bouteille' && wineData && (
        <WineCard data={wineData} onReset={handleReset} />
      )}

      {view === 'result-carte' && carteData && (
        <WineList data={carteData} onReset={handleReset} />
      )}
    </main>
  )
}

function LoadingState({ mode }: { mode: ScanMode }) {
  const label = mode === 'carte' ? 'Lecture de la carte…' : 'Consultation de la cave…'
  return (
    <div className="flex flex-col items-center gap-7">
      <div
        className="w-10 h-10 rounded-full border animate-spin"
        style={{
          borderColor: 'rgba(107, 45, 62, 0.15)',
          borderTopColor: 'var(--color-bordeaux)',
        }}
      />
      <p
        className="italic text-lg"
        style={{ color: 'var(--color-bordeaux)', fontFamily: 'var(--font-playfair)' }}
      >
        {label}
      </p>
    </div>
  )
}
