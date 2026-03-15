import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Editor } from '@toast-ui/react-editor';
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
  const editorRef = useRef(null);
  const initialContentRef = useRef(note?.content || '');

  useEffect(() => {
    initialContentRef.current = note?.content || '';
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setOriginalContent(note?.content || '');
    setHasChanges(false);
  }, [note?.filename, isNew]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleContentChange = () => {
    if (!editorRef.current) return;
    const editorInstance = editorRef.current.getInstance();
    const newContent = editorInstance?.getMarkdown() || '';
    if (newContent !== originalContent) {
      setContent(newContent);
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    const editorInstance = editorRef.current?.getInstance();
    const currentContent = editorInstance?.getMarkdown() || content;
    
    await onSave(title, currentContent);
    setOriginalContent(currentContent);
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

  const handleEditorMount = () => {
    if (editorRef.current && note?.content) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setMarkdown(note.content);
    }
  };

  const editorKey = useMemo(() => `${note?.filename || 'new'}-${isNew}`, [note?.filename, isNew]);

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

      <div className="editor-wrapper">
        <Editor
          key={editorKey}
          ref={editorRef}
          initialValue={note?.content || ''}
          previewStyle="vertical"
          height="100%"
          initialEditType="markdown"
          useCommandShortcut={true}
          onChange={handleContentChange}
          onMount={handleEditorMount}
          hooks={{
            addImageBlobHook: (blob, callback) => {
              callback(URL.createObjectURL(blob), 'image');
              return false;
            }
          }}
        />
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
