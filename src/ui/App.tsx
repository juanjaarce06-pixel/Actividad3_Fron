import React, { useState } from 'react'

type PredictItem = { task:string; label:string; score:number }
type PredictResp = {
  request_id: string; summary: PredictItem[]; detections: {label:string; score:number}[];
  ocr: {label:string; score:number}[]; topk: Record<string, {label:string; score:number}[]>;
  timings_ms: Record<string, number>; timestamp: string; model_version: string;
}

export default function App(){
  const [file, setFile] = useState<File | null>(null)
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const [res, setRes] = useState<PredictResp | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onPick = (f: File | null) => {
    setFile(f); setRes(null); setError(null); if (f) setImgUrl(URL.createObjectURL(f))
  }

  const predict = async () => {
    if (!file) return
    setBusy(true); setError(null)
    try {
      const fd = new FormData(); fd.append('file', file)
      const r = await fetch((window as any).BACKEND_URL + '/predict', {method:'POST', body: fd})
      if (!r.ok) throw new Error(await r.text())
      const j: PredictResp = await r.json(); setRes(j)
    } catch (e:any) { setError(e.message) } finally { setBusy(false) }
  }

  return (
    <div className="min-h-full p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Actividad3 · Clasificador</h1>
        <a className="text-sm underline opacity-80" href={(window as any).BACKEND_URL + '/docs'} target="_blank">API Docs</a>
      </header>

      <main className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        <section className="bg-slate-900/60 rounded-2xl p-4">
          <div className="space-y-3">
            <input type="file" accept="image/*" onChange={e => onPick(e.target.files?.[0] ?? null)} />
            {imgUrl && <img src={imgUrl} className="rounded-lg max-h-[420px] object-contain border border-slate-700" />}
            <button onClick={predict} disabled={!file || busy}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40">
              {busy ? 'Prediciendo...' : 'Predecir'}
            </button>
            {error && <p className="text-red-400 text-sm break-all">{error}</p>}
          </div>
        </section>

        <section className="bg-slate-900/60 rounded-2xl p-4">
          {!res ? (
            <p className="opacity-70">Sube una imagen y ejecuta la predicción para ver resultados.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Resumen</h3>
                <ul className="mt-2 grid grid-cols-2 gap-2">
                  {res.summary.map((s,i) => (
                    <li key={i} className="bg-slate-800/60 p-2 rounded-md">
                      <div className="text-xs uppercase opacity-70">{s.task}</div>
                      <div className="font-semibold">{s.label}</div>
                      <div className="text-xs opacity-70">score: {s.score}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <h4 className="font-semibold">Detecciones</h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    {res.detections.map((d,i)=>(<li key={i} className="opacity-90">• {d.label} ({d.score})</li>))}
                    {!res.detections.length && <li className="opacity-60">—</li>}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">OCR</h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    {res.ocr.map((d,i)=>(<li key={i} className="opacity-90">• {d.label} ({d.score})</li>))}
                    {!res.ocr.length && <li className="opacity-60">—</li>}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Top-K</h4>
                <div className="mt-2 grid md:grid-cols-2 gap-2">
                  {Object.entries(res.topk).map(([k,vals])=>(
                    <div key={k} className="bg-slate-800/60 rounded-md p-2">
                      <div className="text-xs uppercase opacity-70">{k}</div>
                      <ul className="mt-1 text-sm">
                        {vals.map((v,i)=>(<li key={i}>• {v.label} ({v.score})</li>))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs opacity-70">
                <div>request: {res.request_id}</div>
                <div>modelo: {res.model_version}</div>
                <div>tiempo: {res.timings_ms.total} ms</div>
                <div>ts: {res.timestamp}</div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
