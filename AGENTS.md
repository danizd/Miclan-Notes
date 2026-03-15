# Guía para AGENTS - Miclan Notes

## Contexto del Proyecto

Miclan Notes es una aplicación web para gestión de notas en Markdown. El proyecto está funcionando correctamente con un editor de texto plano + preview de Markdown.

## Stack Actual (Funcionando)

- React 18.0.2 + Vite 5.x
- react-markdown + remark-gfm para preview
- Express 4.x

## Características del Editor

- Textarea para edición en Markdown
- Preview renderizado con react-markdown
- Pestañas "Editar" y "Preview" (Preview por defecto al abrir notas)
- Barra de herramientas con botones de formato:
  - Negrita, Cursiva, Tachado
  - Títulos H1, H2, H3
  - Listas (viñetas y numeradas)
  - Citas
  - Código (inline y bloque)
  - Enlaces
  - Divisor

## Estructura Relevante

```
frontend/src/
├── components/
│   ├── NoteEditor.jsx    # Editor con textarea + preview + toolbar
│   ├── NoteList.jsx
│   ├── Sidebar.jsx
│   └── SearchBar.jsx
├── api/client.js         # Cliente API
└── styles/global.css     # Estilos
```

## Cómo construir y probar

```bash
# Desarrollo
cd frontend && npm install
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
