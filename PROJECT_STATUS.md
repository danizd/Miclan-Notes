# Miclan Notes

Aplicación web para gestión personal de notas en formato Markdown.

## Estado del Proyecto

**⚠️ PROBLEMA ACTIVO**: El editor de Markdown (Toast UI Editor) no funciona correctamente en React 17/18. Hay un error "There is no event type mount" que impide usar el editor.

## Características Implementadas

- Backend Express con API REST
- Frontend React + Vite
- Sistema de categorías y notas en filesystem
- Búsqueda global
- Tema visual claro/moderno
- Docker Compose para despliegue

## Stack Tecnológico

| Componente | Tecnología | Versión |
|------------|------------|---------|
| Backend | Node.js + Express | 20 LTS / 4.x |
| Frontend | React + Vite | 17.0.2 / 5.x |
| Editor | Toast UI Editor | 3.2.0 |
| Contenedor | Docker + Docker Compose | Compose v2 |

## Estructura del Proyecto

```
miclan-notes/
├── backend/
│   ├── server.js           # Servidor Express
│   ├── routes/             # API REST
│   ├── utils/             # Helpers
│   └── .env               # Configuración
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api/client.js
│   │   ├── components/
│   │   └── styles/global.css
│   └── package.json
├── documentos/             # Notas de ejemplo
├── start.bat              # Script de inicio local
├── docker-compose.yml
└── Dockerfile
```

## Configuración

### Desarrollo local
1. Copiar `backend/.env.example` a `backend/.env`
2. Ajustar `NOTES_DIR` con la ruta a las notas
3. Ejecutar `start.bat`

### Producción (Docker)
```bash
docker compose up --build
```

## API Endpoints

- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría
- `DELETE /api/categories/:name` - Eliminar categoría
- `GET /api/notes/:category` - Listar notas
- `GET /api/notes/:category/:filename` - Obtener nota
- `POST /api/notes/:category` - Crear nota
- `PUT /api/notes/:category/:filename` - Actualizar nota
- `DELETE /api/notes/:category/:filename` - Eliminar nota
- `GET /api/search?q=term` - Buscar notas

## Problema con el Editor

El editor Toast UI Editor da error "There is no event type mount". Posibles soluciones:

1. Usar otra librería de editor (CodeMirror, Monaco, React-Markdown)
2. Intentar versión específica de Toast UI que funcione
3. Implementar editor simple con textarea + preview

## Repositorio

https://github.com/danizd/Miclan-Notes
