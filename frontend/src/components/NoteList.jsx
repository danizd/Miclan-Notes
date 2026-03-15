import React, { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

export default function NoteList({ 
  category, 
  notes, 
  hasInvalid,
  onSelectNote, 
  onDeleteNote,
  onNewNote,
  loading 
}) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDeleteClick = (note, e) => {
    e.stopPropagation();
    setDeleteConfirm(note);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirm) {
      await onDeleteNote(deleteConfirm.filename);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="panel">
      <div className="note-list-container">
        <div className="note-list-header">
          <h2 className="note-list-title">
            {category}
            {hasInvalid && (
              <span className="warning-badge" title="Algunos archivos no siguen el formato esperado">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
                </svg>
                Archivos inválidos
              </span>
            )}
          </h2>
          <button className="new-note-btn" onClick={onNewNote}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nueva nota
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner" />
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <p>No hay notas en esta categoría</p>
            <button 
              className="new-note-btn" 
              style={{ marginTop: '1rem' }}
              onClick={onNewNote}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Crear primera nota
            </button>
          </div>
        ) : (
          <div className="note-list">
            {notes.map(note => (
              <div
                key={note.filename}
                className="note-item"
                onClick={() => onSelectNote(note)}
              >
                <div className="note-info">
                  <div className="note-title">{note.title}</div>
                  <div className="note-date">{note.dateFormatted}</div>
                </div>
                <button
                  className="note-delete"
                  onClick={(e) => handleDeleteClick(note, e)}
                  title="Eliminar nota"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="¿Eliminar nota?"
        message="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
