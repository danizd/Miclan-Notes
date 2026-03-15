# Miclan Notes

Aplicación web para gestión personal de notas en formato Markdown, diseñada para funcionar junto con [OpenClaw](https://github.com/danizd/openclaw).

## Acerca de OpenClaw + Miclan Notes

Este proyecto forma parte de un flujo de trabajo completo para la gestión de notas:

1. **OpenClaw** - Cliente de escritorio para tomar notas rápidas en Markdown
2. **Miclan Notes** - Aplicación web para visualizar y gestionar las notas

Las notas tomadas con OpenClaw se almacenan en formato Markdown y pueden ser accedidas y gestionadas desde Miclan Notes a través de la red local.

## Características

- **Gestión de notas en Markdown** - Crea, edita y organiza tus notas
- **Categorías** - Organiza tus notas por categorías
- **Búsqueda global** - Busca en todas las notas y categorías
- **Editor dual** - Modo Editar y Preview con Markdown
- **Tema claro** - Diseño moderno y limpio
- **Acceso via red local** - Accede a tus notas desde cualquier dispositivo

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

### Producción (Docker)

```env
NOTES_DIR=/mnt/notas
PORT=3000
```

### Producción con acceso via red

Para acceder desde otros dispositivos en la red local:

```env
NOTES_DIR=/mnt/notas
PORT=3000
VITE_API_URL=http://TU_IP_LOCAL:3000
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
