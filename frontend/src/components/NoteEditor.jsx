import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ConfirmDialog from './ConfirmDialog';

export default function NoteEditor({
  category,
  note,
  isNew,
  onSave,
  onCancel,
  saving
}) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [originalContent, setOriginalContent] = useState(note?.content || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [view, setView] = useState('edit');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setOriginalContent(note.content || '');
      setHasChanges(false);
    } else {
      setTitle('');
      setContent('');
      setOriginalContent('');
      setHasChanges(false);
    }
  }, [note?.filename, isNew]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    await onSave(title, content);
    setOriginalContent(content);
    setHasChanges(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleCancelClick = () => {
    if (hasChanges) {
      setShowConfirmCancel(true);
    } else {
      onCancel();
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmCancel(false);
    onCancel();
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <input
          type="text"
          className="editor-title-input"
          placeholder="Título de la nota"
          value={title}
          onChange={handleTitleChange}
          disabled={!isNew}
        />
        <div className="editor-tabs">
          <button 
            className={`editor-tab ${view === 'edit' ? 'active' : ''}`}
            onClick={() => setView('edit')}
          >
            Editar
          </button>
          <button 
            className={`editor-tab ${view === 'preview' ? 'active' : ''}`}
            onClick={() => setView('preview')}
          >
            Preview
          </button>
        </div>
        <div className="editor-actions">
          <button 
            className="editor-btn secondary"
            onClick={handleCancelClick}
          >
            Cancelar
          </button>
          <button 
            className={`editor-btn primary ${showSaved ? 'saved' : ''}`}
            onClick={handleSave}
            disabled={saving || (!hasChanges && !isNew)}
          >
            {saving ? (
              <>
                <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                Guardando...
              </>
            ) : showSaved ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Guardado
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Guardar
              </>
            )}
          </button>
        </div>
      </div>

      <div className="editor-content">
        {view === 'edit' ? (
          <textarea
            ref={textareaRef}
            className="editor-textarea"
            value={content}
            onChange={handleContentChange}
            placeholder="Escribe tu nota en Markdown..."
            spellCheck="false"
          />
        ) : (
          <div className="editor-preview">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content || '*Sin contenido*'}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirmCancel}
        title="¿Descartar cambios?"
        message="Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?"
        confirmLabel="Descartar"
        cancelLabel="Seguir editando"
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowConfirmCancel(false)}
      />
    </div>
  );
}
