import React from 'react'
import UploadCard from './components/UploadCard'
const App: React.FC = () => {
  const backend = (window as any).__APP_CONFIG__?.BACKEND_URL || import.meta.env.VITE_BACKEND_URL || ''
  return (
    <main style={{maxWidth: 1200, margin: '0 auto', padding: 24}}>
      <h1 style={{fontSize: 24, fontWeight: 700, marginBottom: 16}}>Actividad 3 — Clasificador de Imágenes</h1>
      <p style={{opacity: 0.75, marginBottom: 24}}>
        Backend: <a style={{color:'#22d3ee'}} href={backend} target="_blank" rel="noreferrer">{backend}</a>
      </p>
      <UploadCard backendUrl={backend} />
      <section style={{marginTop: 24, opacity: 0.9}}>
        <h2 style={{fontWeight: 600}}>Métricas básicas</h2>
        <ul style={{lineHeight: 1.8}}>
          <li>Imágenes enviadas (sesión): <span id="metric-count">0</span></li>
          <li>Última latencia: <span id="metric-latency">-</span> ms</li>
          <li>Último estado: <span id="metric-status">-</span></li>
        </ul>
      </section>
    </main>
  )
}
export default App
