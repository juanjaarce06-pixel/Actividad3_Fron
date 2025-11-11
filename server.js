import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 8080;

app.get('/config.js', (_req, res) => {
  const cfg = { BACKEND_URL: process.env.BACKEND_URL || '' };
  res.type('application/javascript');
  res.send(`window.__APP_CONFIG__ = ${JSON.stringify(cfg)};`);
});

// NUEVO: health del frontend (JSON)
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

app.use(express.static(path.join(__dirname, 'dist'), { index: false }));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => console.log(`Frontend listening on ${port}`));
