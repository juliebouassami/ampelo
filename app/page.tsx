'use client'

import { useState } from 'react'
import Scanner, { type ScanMode } from '@/components/Scanner'
import WineCard, { type WineData } from '@/components/WineCard'
import WineList, { type CarteData } from '@/components/WineList'

type View = 'scan' | 'loading' | 'result-bouteille' | 'result-carte'

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

  const handleCapture = async (file: File, mode: ScanMode) => {
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
      {view === 'scan' && <Scanner onCapture={handleCapture} />}
      {view === 'loading' && <LoadingState />}
      {view === 'result-bouteille' && wineData && <WineCard data={wineData} onReset={handleReset} />}
      {view === 'result-carte' && carteData && <WineList data={carteData} onReset={handleReset} />}
    </main>
  )
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-7" style={{ animation: 'fadeIn 0.4s ease' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div
        className="w-10 h-10 rounded-full border animate-spin"
        style={{ borderColor: 'rgba(107, 45, 62, 0.15)', borderTopColor: 'var(--color-bordeaux)' }}
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
