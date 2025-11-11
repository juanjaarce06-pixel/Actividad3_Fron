import React, { useMemo, useRef, useState } from "react";
import type { PredictResponse, TopKItem } from "./types";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const API_BASE =
  (window as any).__APP_CONFIG__?.BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  const canPredict = !!file && !!API_BASE;

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setResult(null);
      const url = URL.createObjectURL(f);
      setPreview(url);
    }
  }

  async function doPredict() {
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_BASE}/predict`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as PredictResponse;
      setResult(data);
      drawChart(data.topk);
    } catch (e) {
      console.error(e);
      alert("Falló la predicción. Revisa la URL del backend o los logs.");
    } finally {
      setLoading(false);
    }
  }

  function drawChart(items: TopKItem[]) {
    const labels = items.map(i => i.label);
    const values = items.map(i => i.prob);

    if (!canvasRef.current) return;

    // destruye el gráfico anterior si existe
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [{ label: "Probabilidad", data: values }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 1, ticks: { callback: (v) => v.toString() } }
        }
      }
    });
  }

  const bestLine = useMemo(() => {
    if (!result) return "";
    const { best } = result;
    return `Predicción: ${best.label} (${(best.prob * 100).toFixed(1)}%)`;
    // Nota: best.label viene de ImageNet; muchas veces son objetos comunes (no solo animales)
  }, [result]);

  return (
    <div style={{ minHeight: "100vh", background: "#0B1221", color: "#e5e7eb", padding: "24px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Actividad 3 — Clasificador de Imágenes</h1>
          <p style={{ opacity: 0.85 }}>Cargue una imagen y vea la predicción (Top-5) con sus probabilidades.</p>
          <p style={{ fontSize: 12, opacity: 0.7 }}>Backend: <code>{API_BASE || "(no definido)"}</code></p>
        </header>

        <section style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24
        }}>
          <div style={{ background: "#111827", borderRadius: 16, padding: 16, boxShadow: "0 6px 18px rgba(0,0,0,.25)" }}>
            <h2 style={{ fontSize: 18, marginBottom: 12 }}>1) Selección de imagen</h2>
            <input type="file" accept="image/*" onChange={onPick} />
            {preview && (
              <div style={{ marginTop: 12 }}>
                <img src={preview} alt="preview" style={{ width: "100%", maxHeight: 360, objectFit: "contain", borderRadius: 12 }} />
              </div>
            )}
            <button
              onClick={doPredict}
              disabled={!canPredict || loading}
              style={{
                marginTop: 16, padding: "10px 16px", borderRadius: 12,
                background: canPredict && !loading ? "#22c55e" : "#374151",
                color: "white", fontWeight: 600, border: "none", cursor: canPredict && !loading ? "pointer" : "not-allowed"
              }}
              title={!API_BASE ? "BACKEND_URL no definido en config.js" : ""}
            >
              {loading ? "Clasificando..." : "Clasificar imagen"}
            </button>
            <p style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
              La URL del backend se inyecta desde <code>/config.js</code> (Cloud Run env <code>BACKEND_URL</code>).
            </p>
          </div>

          <div style={{ background: "#111827", borderRadius: 16, padding: 16, boxShadow: "0 6px 18px rgba(0,0,0,.25)" }}>
            <h2 style={{ fontSize: 18, marginBottom: 12 }}>2) Resultado</h2>
            {!result && <p style={{ opacity: 0.8 }}>Aún no hay predicción</p>}
            {result && (
              <>
                <p style={{ marginBottom: 8, fontWeight: 600 }}>{bestLine}</p>
                <div style={{ height: 320 }}>
                  <canvas ref={canvasRef} />
                </div>
                <ul style={{ marginTop: 10, fontSize: 14 }}>
                  {result.topk.map((t, i) => (
                    <li key={t.index} style={{ opacity: i ? 0.9 : 1 }}>
                      {i + 1}. {t.label} — {(t.prob * 100).toFixed(2)}%
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
