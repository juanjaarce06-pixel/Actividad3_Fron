import React, { useState } from 'react'
type Props = { backendUrl: string }
const UploadCard: React.FC<Props> = ({ backendUrl }) => {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null); setResult(null); setError(null)
  }
  const onUpload = async () => {
    if (!file) return
    if (!backendUrl) { setError('BACKEND_URL no configurado'); return }
    setLoading(true); setError(null)
    const t0 = performance.now()
    try {
      const form = new FormData()
      form.append('file', file)
      const resp = await fetch(`${backendUrl.replace(/\/$/, '')}/predict`, { method:'POST', body: form })
      ;(document.getElementById('metric-status')!).textContent = String(resp.status)
      if (!resp.ok) { throw new Error(`HTTP ${resp.status}: ${await resp.text()}`) }
      const json = await resp.json(); setResult(json)
    } catch (err:any) { setError(err?.message || 'Error de red') }
    finally {
      const t1 = performance.now()
      ;(document.getElementById('metric-latency')!).textContent = `${Math.round(t1 - t0)}`
      const cEl = document.getElementById('metric-count')!; cEl.textContent = String(Number(cEl.textContent||'0')+1)
      setLoading(false)
    }
  }
  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, border:'1px dashed #334155', borderRadius:12, padding:16}}>
      <div>
        <div style={{marginBottom:12}}><input type="file" accept="image/*" onChange={onChange} /></div>
        <button onClick={onUpload} disabled={!file||loading} style={{background:'#22c55e', color:'#0b1221', padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:600}}>
          {loading ? 'Enviando…' : 'Predecir'}
        </button>
        {error && <p style={{color:'#f87171', marginTop:12}}>Error: {error}</p>}
      </div>
      <div style={{background:'#0f172a', borderRadius:12, padding:16, minHeight:180}}>
        <h3 style={{fontWeight:600, marginBottom:8}}>Resultado</h3>
        <pre style={{whiteSpace:'pre-wrap'}}>{result ? JSON.stringify(result, null, 2) : 'Sin datos'}</pre>
      </div>
    </div>
  )
}
export default UploadCard
