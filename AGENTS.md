# Guía para AGENTS - Miclan Notes

## Contexto del Proyecto

Miclan Notes es una aplicación web para gestión de notas en Markdown. El proyecto está incompleto debido a un problema con el editor de Markdown.

## Problema Actual

**El editor de notas no funciona**: Toast UI Editor genera el error "There is no event type mount" al intentar cargar/crear una nota.

## Stack Actual (no funciona bien)

- React 17.0.2 + Vite 5.x
- @toast-ui/react-editor 3.2.0
- @toast-ui/editor 3.2.0

## Tareas Pendientes

### 1. CRÍTICO: Arreglar el editor de notas
El editor debe permitir:
- Ver el contenido Markdown de las notas existentes
- Crear nuevas notas
- Editar y guardar notas

Opciones recomendadas:
- **Opción A**: Cambiar a otra librería (CodeMirror 6, Monaco Editor, react-markdown)
- **Opción B**: Usar un textarea simple con preview de Markdown
- **Opción C**: Encontrar la versión correcta de Toast UI que funcione

### 2. Mejorar la aplicación
- Guardar notas correctamente en el filesystem
- Mejoras de UX según sea necesario

## Estructura Relevante

```
frontend/src/
├── components/
│   ├── NoteEditor.jsx    # Editor - PROBLEMA AQUÍ
│   ├── NoteList.jsx
│   ├── Sidebar.jsx
│   └── SearchBar.jsx
├── api/client.js         # Cliente API
└── styles/global.css     # Estilos
```

## Cómo construir y probar

```bash
# Desarrollo
cd frontend && npm install --legacy-peer-deps
npm run dev

# Producción
cd frontend && npm run build
cp -r dist/* ../backend/public/
cd ../backend && node server.js
```

## URL del repositorio

https://github.com/danizd/Miclan-Notes

## Notas de configuración

- El backend usa `.env` en `backend/.env`
- `NOTES_DIR` debe apuntar al directorio de notas
- El frontend compilado se sirve desde `backend/public/`
