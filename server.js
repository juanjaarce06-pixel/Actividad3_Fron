import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port = process.env.PORT || 8080
app.get('/config.js', (_req, res) => {
  const cfg = { BACKEND_URL: process.env.BACKEND_URL || '' }
  res.type('application/javascript').send(`window.__APP_CONFIG__ = ${JSON.stringify(cfg)};`)
})
app.use(express.static(path.join(__dirname, 'dist')))
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')))
app.listen(port, () => console.log(`Frontend listening on ${port}`))
