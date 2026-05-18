'use client'

import { useState } from 'react'
import Scanner from '@/components/Scanner'
import WineCard, { type WineData } from '@/components/WineCard'

type View = 'scan' | 'loading' | 'result'

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

  const handleCapture = async (file: File) => {
    setView('loading')

    try {
      const base64 = await fileToBase64(file)
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType: file.type }),
      })

      const data: WineData = await res.json()
      setWineData(data)
      setView('result')
    } catch {
      setWineData({ success: false, erreur: "Erreur de connexion. Réessayez." })
      setView('result')
    }
  }

  const handleReset = () => {
    setView('scan')
    setWineData(null)
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
        <LoadingState />
      )}

      {view === 'result' && wineData && (
        <WineCard data={wineData} onReset={handleReset} />
      )}
    </main>
  )
}

function LoadingState() {
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
        Consultation de la cave…
      </p>
    </div>
  )
}
