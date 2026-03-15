import path from 'path';

export function safePath(base, ...parts) {
  const joined = path.join(base, ...parts);
  const resolved = path.resolve(joined);
  const baseResolved = path.resolve(base);

  if (!resolved.startsWith(baseResolved)) {
    const error = new Error('Forbidden: Path traversal detected');
    error.status = 403;
    throw error;
  }

  return resolved;
}
