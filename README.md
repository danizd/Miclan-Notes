# Miclan Notes

Aplicación web para gestión personal de notas en formato Markdown.

## Características

- **Gestión de notas en Markdown** - Crea, edita y organiza tus notas
- **Categorías** - Organiza tus notas por categorías
- **Búsqueda global** - Busca en todas las notas y categorías
- **Editor dual** - Modo WYSIWYG y Markdown
- **Tema oscuro** - Diseño editorial refinado

## Stack

| Componente | Tecnología |
|------------|------------|
| Backend | Node.js 20 + Express |
| Frontend | React 18 + Vite |
| Editor | Toast UI Editor |
| Contenedor | Docker + Docker Compose |

## Estructura de notas

```
NOTES_DIR/
├── categoria-uno/
│   ├── 2024-01-15-primera-nota.md
│   └── 2024-03-22-otra-nota.md
└── categoria-dos/
    └── ...
```

## Configuración

### Desarrollo local

1. Copia `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Ajusta las variables en `.env`:
```env
NOTES_DIR=/ruta/a/tus/notas
PORT=3000
VITE_API_URL=http://localhost:3000
```

3. Levanta la aplicación:
```bash
docker compose up --build
```

### Producción

```env
NOTES_DIR=/mnt/notas
PORT=3000
VITE_API_URL=http://100.121.99.57:3000
```

## API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/categories` | Listar categorías |
| POST | `/api/categories` | Crear categoría |
| DELETE | `/api/categories/:name` | Eliminar categoría |
| GET | `/api/notes/:category` | Listar notas |
| GET | `/api/notes/:category/:filename` | Obtener nota |
| POST | `/api/notes/:category` | Crear nota |
| PUT | `/api/notes/:category/:filename` | Actualizar nota |
| DELETE | `/api/notes/:category/:filename` | Eliminar nota |
| GET | `/api/search?q=term` | Buscar notas |

## Licencia

MIT
