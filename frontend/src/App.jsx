import React, { useState, useEffect, useCallback } from 'react';
import { api } from './api/client';
import Sidebar from './components/Sidebar';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import SearchBar from './components/SearchBar';

export default function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNewNote, setIsNewNote] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasInvalidNotes, setHasInvalidNotes] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const data = await api.categories.list();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  const loadNotes = useCallback(async (category) => {
    if (!category) return;
    setLoadingNotes(true);
    try {
      const data = await api.notes.list(category);
      setNotes(data.notes);
      setHasInvalidNotes(data.hasInvalid);
    } catch (err) {
      console.error('Error loading notes:', err);
    } finally {
      setLoadingNotes(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (selectedCategory) {
      loadNotes(selectedCategory);
    }
  }, [selectedCategory, loadNotes]);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setSelectedNote(null);
    setIsNewNote(false);
    setSidebarOpen(false);
  };

  const handleCreateCategory = async (name) => {
    await api.categories.create(name);
    await loadCategories();
  };

  const handleDeleteCategory = async (name) => {
    await api.categories.delete(name);
    if (selectedCategory === name) {
      setSelectedCategory(null);
      setSelectedNote(null);
      setNotes([]);
    }
    await loadCategories();
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setIsNewNote(false);
  };

  const handleOpenNote = async (category, filename) => {
    try {
      const note = await api.notes.get(category, filename);
      setSelectedCategory(category);
      setSelectedNote(note);
      setIsNewNote(false);
    } catch (err) {
      console.error('Error opening note:', err);
    }
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setIsNewNote(true);
  };

  const handleSaveNote = async (title, content) => {
    setSaving(true);
    try {
      if (isNewNote) {
        const result = await api.notes.create(selectedCategory, title, content);
        await loadNotes(selectedCategory);
        const note = await api.notes.get(selectedCategory, result.filename);
        setSelectedNote(note);
        setIsNewNote(false);
      } else {
        await api.notes.update(selectedCategory, selectedNote.filename, content);
        await loadNotes(selectedCategory);
      }
    } catch (err) {
      console.error('Error saving note:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedNote(null);
    setIsNewNote(false);
  };

  const handleDeleteNote = async (filename) => {
    try {
      await api.notes.delete(selectedCategory, filename);
      await loadNotes(selectedCategory);
      if (selectedNote?.filename === filename) {
        setSelectedNote(null);
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const handleSearchSelect = (category, filename) => {
    handleOpenNote(category, filename);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="header-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Miclan Notes
          </h1>
        </div>
        <SearchBar onSelectNote={handleSearchSelect} />
      </header>

      <main className="main-content">
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}
        
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onCreateCategory={handleCreateCategory}
          onDeleteCategory={handleDeleteCategory}
          loading={loadingCategories}
        />

        {!selectedCategory && !selectedNote && !isNewNote && (
          <div className="welcome-screen">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <h2>Selecciona una categoría</h2>
            <p>Elige una categoría del sidebar para ver sus notas</p>
          </div>
        )}

        {selectedCategory && !selectedNote && !isNewNote && (
          <NoteList
            category={selectedCategory}
            notes={notes}
            hasInvalid={hasInvalidNotes}
            onSelectNote={handleSelectNote}
            onDeleteNote={handleDeleteNote}
            onNewNote={handleNewNote}
            loading={loadingNotes}
          />
        )}

        {(selectedNote || isNewNote) && (
          <NoteEditor
            category={selectedCategory}
            note={selectedNote}
            isNew={isNewNote}
            onSave={handleSaveNote}
            onCancel={handleCancelEdit}
            saving={saving}
          />
        )}
      </main>
    </div>
  );
}
