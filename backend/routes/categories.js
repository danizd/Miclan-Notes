import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { NOTES_DIR } from '../server.js';
import { safePath } from '../utils/pathGuard.js';

const router = express.Router();

const categoryNameRegex = /^[a-z0-9\-_]{1,60}$/;

router.get('/', async (req, res, next) => {
  try {
    const notesDir = safePath(NOTES_DIR);
    await fs.access(notesDir);
    const entries = await fs.readdir(notesDir, { withFileTypes: true });

    const categories = await Promise.all(
      entries
        .filter(entry => entry.isDirectory())
        .map(async (entry) => {
          const categoryPath = safePath(notesDir, entry.name);
          const files = await fs.readdir(categoryPath);
          const mdFiles = files.filter(f => f.endsWith('.md'));
          const invalidFiles = files.filter(f => !f.endsWith('.md'));

          return {
            name: entry.name,
            noteCount: mdFiles.length,
            hasInvalid: invalidFiles.length > 0
          };
        })
    );

    res.json(categories);
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.json([]);
      return;
    }
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !categoryNameRegex.test(name)) {
      res.status(400).json({ error: 'Nombre inválido. Solo letras minúsculas, números, guiones y guiones bajos (1-60 caracteres).' });
      return;
    }

    const categoryPath = safePath(NOTES_DIR, name);
    
    try {
      await fs.access(categoryPath);
      res.status(409).json({ error: 'La categoría ya existe.' });
      return;
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }

    await fs.mkdir(categoryPath, { recursive: true });
    res.status(201).json({ name });
  } catch (err) {
    next(err);
  }
});

router.delete('/:name', async (req, res, next) => {
  try {
    const { name } = req.params;

    if (!categoryNameRegex.test(name)) {
      res.status(400).json({ error: 'Nombre de categoría inválido.' });
      return;
    }

    const categoryPath = safePath(NOTES_DIR, name);

    try {
      await fs.access(categoryPath);
    } catch {
      res.status(404).json({ error: 'Categoría no encontrada.' });
      return;
    }

    await fs.rm(categoryPath, { recursive: true, force: true });
    res.json({ deleted: name });
  } catch (err) {
    next(err);
  }
});

export default router;
