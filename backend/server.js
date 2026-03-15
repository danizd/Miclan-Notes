import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import categoriesRouter from './routes/categories.js';
import notesRouter from './routes/notes.js';
import searchRouter from './routes/search.js';

const app = express();
const PORT = process.env.PORT || 3000;
export const NOTES_DIR = process.env.NOTES_DIR;

if (!NOTES_DIR) {
  console.error('ERROR: La variable de entorno NOTES_DIR no está definida.');
  process.exit(1);
}

app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Error interno del servidor.' });
});

app.use('/api/categories', categoriesRouter);
app.use('/api/notes', notesRouter);
app.use('/api/search', searchRouter);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Miclan Notes corriendo en http://localhost:${PORT}`);
  console.log(`Directorio de notas: ${NOTES_DIR}`);
});
