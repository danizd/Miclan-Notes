import React, { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

const categoryNameRegex = /^[a-z0-9\-_]+$/;

export default function Sidebar({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  onCreateCategory, 
  onDeleteCategory,
  loading 
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleCreate = async () => {
    const name = newCategoryName.trim().toLowerCase();
    
    if (!categoryNameRegex.test(name)) {
      setError('Solo letras minúsculas, números, guiones y guiones bajos');
      return;
    }

    try {
      await onCreateCategory(name);
      setNewCategoryName('');
      setIsCreating(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCreate();
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewCategoryName('');
      setError('');
    }
  };

  const handleDeleteClick = (category) => {
    setDeleteConfirm(category);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirm) {
      await onDeleteCategory(deleteConfirm.name);
      setDeleteConfirm(null);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">Categorías</div>
      
      <div className="category-list">
        {loading ? (
          <div className="loading">
            <div className="spinner" style={{ width: 20, height: 20 }} />
          </div>
        ) : categories.length === 0 && !isCreating ? (
          <div className="empty-state" style={{ padding: '2rem 1rem' }}>
            <p>No hay categorías</p>
          </div>
        ) : (
          categories.map(cat => (
            <div
              key={cat.name}
              className={`category-item ${selectedCategory === cat.name ? 'active' : ''} ${cat.hasInvalid ? 'has-invalid' : ''}`}
              onClick={() => onSelectCategory(cat.name)}
            >
              <span className="category-name">{cat.name}</span>
              <span className="category-count">{cat.noteCount}</span>
              <button
                className="category-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(cat);
                }}
                title="Eliminar categoría"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
              {cat.hasInvalid && (
                <span className="warning-badge" title="Algunos archivos no siguen el formato esperado">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
                  </svg>
                </span>
              )}
            </div>
          ))
        )}
      </div>

      <div className="new-category">
        {isCreating ? (
          <div className="new-category-form">
            <input
              type="text"
              className="new-category-input"
              placeholder="nombre-categoria"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button className="new-category-btn" onClick={handleCreate}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
            <button 
              className="new-category-btn secondary" 
              onClick={() => {
                setIsCreating(false);
                setNewCategoryName('');
                setError('');
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ) : (
          <button 
            className="new-category-btn secondary" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setIsCreating(true)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nueva categoría
          </button>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title={deleteConfirm?.noteCount > 0 ? '¿Eliminar categoría?' : '¿Eliminar categoría vacía?'}
        message={
          deleteConfirm?.noteCount > 0
            ? `Esta categoría contiene ${deleteConfirm.noteCount} notas. ¿Eliminar todo?`
            : '¿Eliminar esta categoría?'
        }
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </aside>
  );
}
