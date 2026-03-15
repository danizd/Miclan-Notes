import fs from 'fs/promises';
import path from 'path';

export function toSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function fromSlug(slug) {
  return slug
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function extractTitleFromFilename(filename) {
  const base = path.basename(filename, '.md');
  const match = base.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
  if (match) {
    return fromSlug(match[1]);
  }
  return base;
}

export function extractDateFromFilename(filename) {
  const base = path.basename(filename, '.md');
  const match = base.match(/^(\d{4}-\d{2}-\d{2})-/);
  return match ? match[1] : null;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export async function ensureDir(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

export function generateUniqueFilename(dirPath, baseName) {
  const ext = '.md';
  let filename = baseName + ext;
  let counter = 1;

  return (async () => {
    try {
      await fs.access(path.join(dirPath, filename));
      while (true) {
        filename = `${baseName}-${counter}${ext}`;
        try {
          await fs.access(path.join(dirPath, filename));
          counter++;
        } catch {
          return filename;
        }
      }
    } catch {
      return filename;
    }
  })();
}
