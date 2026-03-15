import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { NOTES_DIR } from '../server.js';
import { safePath } from '../utils/pathGuard.js';
import { extractTitleFromFilename, extractDateFromFilename, formatDate } from '../utils/fileHelpers.js';

const router = express.Router();

const filenameRegex = /^\d{4}-\d{2}-\d{2}-.+\.md$/;

function createExcerpt(content, query, maxLength = 150) {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerContent.indexOf(lowerQuery);

  if (idx === -1) {
    return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
  }

  const start = Math.max(0, idx - 50);
  const end = Math.min(content.length, idx + query.length + 100);
  let excerpt = content.substring(start, end);

  if (start > 0) excerpt = '...' + excerpt;
  if (end < content.length) excerpt = excerpt + '...';

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  excerpt = excerpt.replace(regex, '**$1**');

  return excerpt;
}

router.get('/', async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      res.json([]);
      return;
    }

    const notesDir = safePath(NOTES_DIR);
    const query = q.trim();
    const results = [];

    try {
      await fs.access(notesDir);
    } catch {
      res.json([]);
      return;
    }

    const entries = await fs.readdir(notesDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const category = entry.name;
      const categoryPath = safePath(notesDir, category);

      let files;
      try {
        files = await fs.readdir(categoryPath);
      } catch {
        continue;
      }

      for (const filename of files) {
        if (!filename.endsWith('.md')) continue;

        const filePath = safePath(categoryPath, filename);

        let content;
        try {
          content = await fs.readFile(filePath, 'utf-8');
        } catch {
          continue;
        }

        const lowerContent = content.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const filenameLower = filename.toLowerCase();

        const matchesFilename = filenameLower.includes(lowerQuery);
        const matchesContent = lowerContent.includes(lowerQuery);

        if (matchesFilename || matchesContent) {
          const date = extractDateFromFilename(filename);

          let excerpt = '';
          if (matchesContent) {
            excerpt = createExcerpt(content, query);
          } else {
            const title = extractTitleFromFilename(filename);
            excerpt = createExcerpt(title + '\n\n' + content, query);
          }

          results.push({
            category,
            filename,
            title: extractTitleFromFilename(filename),
            date,
            dateFormatted: formatDate(date),
            excerpt
          });

          if (results.length >= 30) {
            break;
          }
        }
      }

      if (results.length >= 30) {
        break;
      }
    }

    res.json(results);
  } catch (err) {
    next(err);
  }
});

export default router;
