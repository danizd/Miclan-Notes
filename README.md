# Miclan Notes

Aplicación web para gestión personal de notas en formato Markdown.

## Características

- **Gestión de notas en Markdown** - Crea, edita y organiza tus notas
- **Categorías** - Organiza tus notas por categorías
- **Búsqueda global** - Busca en todas las notas y categorías
- **Editor dual** - Modo Editar y Preview con Markdown
- **Tema claro** - Diseño moderno y limpio

## Stack

| Componente | Tecnología |
|------------|------------|
| Backend | Node.js 20 + Express |
| Frontend | React 18 + Vite |
| Editor | Textarea + react-markdown |
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

1. Copia `.env.example` a `backend/.env`:
```bash
cp .env.example backend/.env
```

2. Ajusta las variables en `backend/.env`:
```env
NOTES_DIR=C:/ruta/a/tus/notas
PORT=3000
```

3. Levanta la aplicación:
```bash
start.bat
```

### Producción

```env
NOTES_DIR=/mnt/notas
PORT=3000
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

## Desarrollo

```bash
# Instalar dependencias
cd frontend && npm install
cd ../backend && npm install

# Desarrollo (dos terminal)
# Terminal 1: cd backend && node server.js
# Terminal 2: cd frontend && npm run dev

# Producción
cd frontend && npm run build
cp -r dist/* ../backend/public/
cd ../backend && node server.js
```

## Repositorio

https://github.com/danizd/Miclan-Notes

## Licencia

MIT
