import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/client';

export default function SearchBar({ onSelectNote }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.search.query(query);
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSelect = (result) => {
    setQuery('');
    setIsOpen(false);
    onSelectNote(result.category, result.filename);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div className="search-container" ref={containerRef}>
      <div className="search-input-wrapper">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar notas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {isOpen && (
        <div className="search-results">
          {loading ? (
            <div className="loading">
              <div className="spinner" style={{ width: 20, height: 20 }} />
            </div>
          ) : results.length > 0 ? (
            results.map((result, idx) => (
              <div
                key={`${result.category}-${result.filename}-${idx}`}
                className="search-result-item"
                onClick={() => handleSelect(result)}
              >
                <span className="search-result-category">{result.category}</span>
                <div className="search-result-title">{result.title}</div>
                <div 
                  className="search-result-excerpt"
                  dangerouslySetInnerHTML={{ __html: result.excerpt }}
                />
              </div>
            ))
          ) : (
            <div className="search-empty">
              Sin resultados para "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
