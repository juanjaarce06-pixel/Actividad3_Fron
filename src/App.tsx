import React, { useState } from 'react'
import { backendUrl } from './api'

type Result = { prediction: string; probability: number }

export default function App() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResult(null); setError(null); setFile(e.target.files?.[0] ?? null)
  }

  const onSend = async () => {
    if (!file) { setError('Selecciona una imagen'); return }
    const form = new FormData()
    form.append('file', file)
    try {
      const resp = await fetch(`${backendUrl()}/predict`, { method: 'POST', body: form })
      if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`)
      setResult(await resp.json())
    } catch (e:any) { setError(e.message) }
  }

  return (
    <main style={{maxWidth: 960, margin:'40px auto', color:'#fff', fontFamily:'system-ui, Arial'}}>
      <h1>Actividad 3 — Clasificador de Imágenes</h1>
      <p>Backend: <a style={{color:'#9cf'}} href={backendUrl()} target="_blank">{backendUrl()}</a></p>
      <input type="file" accept="image/*" onChange={onChange} />
      <button onClick={onSend} style={{marginLeft:10}}>Predecir</button>
      <div style={{marginTop:20, padding:16, background:'#111', borderRadius:8}}>
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        {error && <pre style={{color:'#f88'}}>{error}</pre>}
      </div>
    </main>
  )
}
