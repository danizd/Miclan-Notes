import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { NOTES_DIR } from '../server.js';
import { safePath } from '../utils/pathGuard.js';
import { toSlug, extractTitleFromFilename, extractDateFromFilename, formatDate, ensureDir, generateUniqueFilename } from '../utils/fileHelpers.js';

const router = express.Router();

const filenameRegex = /^\d{4}-\d{2}-\d{2}-.+\.md$/;

router.get('/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const categoryPath = safePath(NOTES_DIR, category);

    try {
      await fs.access(categoryPath);
    } catch {
      res.status(404).json({ error: 'Categoría no encontrada.' });
      return;
    }

    const files = await fs.readdir(categoryPath);
    const mdFiles = files.filter(f => f.endsWith('.md') && filenameRegex.test(f));
    const invalidFiles = files.filter(f => !(f.endsWith('.md') && filenameRegex.test(f)));

    const notes = mdFiles
      .map(filename => {
        const date = extractDateFromFilename(filename);
        return {
          filename,
          title: extractTitleFromFilename(filename),
          date,
          dateFormatted: formatDate(date)
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      notes,
      hasInvalid: invalidFiles.length > 0
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:category/:filename', async (req, res, next) => {
  try {
    const { category, filename } = req.params;

    if (!filenameRegex.test(filename)) {
      res.status(400).json({ error: 'Nombre de nota inválido.' });
      return;
    }

    const filePath = safePath(NOTES_DIR, category, filename);

    try {
      await fs.access(filePath);
    } catch {
      res.status(404).json({ error: 'Nota no encontrada.' });
      return;
    }

    const content = await fs.readFile(filePath, 'utf-8');
    const date = extractDateFromFilename(filename);

    res.json({
      filename,
      title: extractTitleFromFilename(filename),
      date,
      content
    });
  } catch (err) {
    next(err);
  }
});

router.post('/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const { title, content } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({ error: 'El título es obligatorio.' });
      return;
    }

    const categoryPath = safePath(NOTES_DIR, category);

    try {
      await fs.access(categoryPath);
    } catch {
      res.status(404).json({ error: 'Categoría no encontrada.' });
      return;
    }

    const slug = toSlug(title);
    const date = new Date().toISOString().split('T')[0];
    const baseName = `${date}-${slug}`;
    const filename = await generateUniqueFilename(categoryPath, baseName);

    const fullContent = content || `# ${title}\n\n`;

    await fs.writeFile(path.join(categoryPath, filename), fullContent, 'utf-8');

    res.status(201).json({
      filename,
      title,
      date
    });
  } catch (err) {
    next(err);
  }
});

router.put('/:category/:filename', async (req, res, next) => {
  try {
    const { category, filename } = req.params;
    const { content } = req.body;

    if (content === undefined) {
      res.status(400).json({ error: 'El contenido es obligatorio.' });
      return;
    }

    if (!filenameRegex.test(filename)) {
      res.status(400).json({ error: 'Nombre de nota inválido.' });
      return;
    }

    const filePath = safePath(NOTES_DIR, category, filename);

    try {
      await fs.access(filePath);
    } catch {
      res.status(404).json({ error: 'Nota no encontrada.' });
      return;
    }

    await fs.writeFile(filePath, content, 'utf-8');

    res.json({ filename, updated: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/:category/:filename', async (req, res, next) => {
  try {
    const { category, filename } = req.params;

    if (!filenameRegex.test(filename)) {
      res.status(400).json({ error: 'Nombre de nota inválido.' });
      return;
    }

    const filePath = safePath(NOTES_DIR, category, filename);

    try {
      await fs.access(filePath);
    } catch {
      res.status(404).json({ error: 'Nota no encontrada.' });
      return;
    }

    await fs.unlink(filePath);

    res.json({ deleted: filename });
  } catch (err) {
    next(err);
  }
});

export default router;
