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
  const [view, setView] = useState(isNew ? 'edit' : 'preview');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setOriginalContent(note.content || '');
      setHasChanges(false);
      setView('preview');
    } else {
      setTitle('');
      setContent('');
      setOriginalContent('');
      setHasChanges(false);
      setView('edit');
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

  const insertFormat = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newText);
    setHasChanges(true);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const handleBold = () => insertFormat('**', '**');
  const handleItalic = () => insertFormat('*', '*');
  const handleStrike = () => insertFormat('~~', '~~');
  const handleH1 = () => insertFormat('# ');
  const handleH2 = () => insertFormat('## ');
  const handleH3 = () => insertFormat('### ');
  const handleList = () => insertFormat('- ');
  const handleListOrdered = () => insertFormat('1. ');
  const handleQuote = () => insertFormat('> ');
  const handleCode = () => insertFormat('`', '`');
  const handleCodeBlock = () => insertFormat('```\n', '\n```');
  const handleLink = () => insertFormat('[', '](url)');
  const handleDivider = () => insertFormat('\n---\n');

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

      {view === 'edit' && (
        <div className="editor-toolbar">
          <button className="toolbar-btn" onClick={handleBold} title="Negrita (Ctrl+B)">
            <strong>B</strong>
          </button>
          <button className="toolbar-btn" onClick={handleItalic} title="Cursiva (Ctrl+I)">
            <em>I</em>
          </button>
          <button className="toolbar-btn" onClick={handleStrike} title="Tachado">
            <s>S</s>
          </button>
          <span className="toolbar-divider" />
          <button className="toolbar-btn" onClick={handleH1} title="Título 1">H1</button>
          <button className="toolbar-btn" onClick={handleH2} title="Título 2">H2</button>
          <button className="toolbar-btn" onClick={handleH3} title="Título 3">H3</button>
          <span className="toolbar-divider" />
          <button className="toolbar-btn" onClick={handleList} title="Lista">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
          <button className="toolbar-btn" onClick={handleListOrdered} title="Lista ordenada">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
              <path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
            </svg>
          </button>
          <button className="toolbar-btn" onClick={handleQuote} title="Cita">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3" />
            </svg>
          </button>
          <span className="toolbar-divider" />
          <button className="toolbar-btn" onClick={handleCode} title="Código">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
          </button>
          <button className="toolbar-btn" onClick={handleCodeBlock} title="Bloque de código">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><polyline points="9 9 6 12 9 15" /><polyline points="15 9 18 12 15 15" />
            </svg>
          </button>
          <button className="toolbar-btn" onClick={handleLink} title="Enlace">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </button>
          <button className="toolbar-btn" onClick={handleDivider} title="Divisor">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
            </svg>
          </button>
        </div>
      )}

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
