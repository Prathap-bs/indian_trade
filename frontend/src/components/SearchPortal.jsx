import React, { useState, useEffect, useRef } from 'react';

const SearchPortal = ({ apiBaseUrl, onSelectProduct }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const dropdownRef = useRef(null);

  const recommendationChips = [
    { code: '84713010', label: 'Laptops' },
    { code: '85171300', label: 'Smartphones' },
    { code: '30049099', label: 'Medicaments' },
    { code: '61091000', label: 'T-Shirts' },
    { code: '10063020', label: 'Basmati Rice' },
    { code: '09012190', label: 'Coffee' },
  ];

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        try {
          const res = await fetch(`${apiBaseUrl}/api/tariffs/search?query=${encodeURIComponent(query)}`);
          if (res.ok) {
            const data = await res.json();
            setSuggestions(data);
            setShowSuggestions(true);
            setSearchAttempted(true);
          }
        } catch (err) {
          console.error('Error fetching suggestions:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setSearchAttempted(false);
      }
    }, 200);
    return () => clearTimeout(delayDebounce);
  }, [query, apiBaseUrl]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/api/tariffs/search?query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchAttempted(true);
        if (data.length > 0) {
          onSelectProduct(data[0]);
          setShowSuggestions(false);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (product) => {
    setQuery(product.code);
    onSelectProduct(product);
    setShowSuggestions(false);
  };

  const handleChipClick = async (code) => {
    setQuery(code);
    try {
      const res = await fetch(`${apiBaseUrl}/api/tariffs/detail/${code}`);
      if (res.ok) {
        const data = await res.json();
        onSelectProduct(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <img src="/images/hero_banner.png" alt="Indian Trade" />
        <div className="hero-overlay">
          <h2>
            India's Single Window Trade Intelligence Portal
            {/* ===== HEURISTIC #10: Help Tooltip (Help & Documentation) ===== */}
            <span className="help-tooltip-wrap">
              <span className="help-tooltip-icon" aria-label="Help: What is this portal?">?</span>
              <span className="help-tooltip-content">
                <strong>How to use this portal:</strong><br />
                Search by <strong>HS Code</strong> (e.g. 84713010) or by <strong>product keyword</strong> (e.g. "laptops"). 
                The HS Code is a standardized 8-digit number used by Indian Customs to classify goods for import/export. 
                Results will show tariff rates, FTA preferential duties, and compliance requirements.
              </span>
            </span>
          </h2>
          <p>
            Search HS codes, customs tariffs, preferential rates under FTAs, export incentives, SPS/TBT regulations for 90+ countries
          </p>

          <div className="search-container-wrap" ref={dropdownRef}>
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="search-input-field"
                placeholder="Enter HS Code or product keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
                aria-label="Search for HS Code or product"
              />
              {/* ===== HEURISTIC #1: Loading Spinner (Visibility of System Status) ===== */}
              <button type="submit" className="search-button-inner" disabled={loading}>
                {loading ? (
                  <><span className="loading-spinner"></span> Searching</>
                ) : (
                  'Search'
                )}
              </button>
            </form>

            {/* ===== HEURISTIC #1: Autocomplete Results with No-Results State ===== */}
            {showSuggestions && (
              <div className="autocomplete-dropdown">
                {suggestions.length > 0 ? (
                  suggestions.map((p) => (
                    <div key={p.code} className="autocomplete-item" onClick={() => handleSuggestionClick(p)}>
                      <span className="autocomplete-code">{p.code}</span>
                      <span className="autocomplete-desc" title={p.description}>{p.description}</span>
                      <span className="autocomplete-cat">{p.category}</span>
                    </div>
                  ))
                ) : (
                  searchAttempted && !loading && (
                    <div className="no-results-state">
                      <div className="no-results-icon">🔍</div>
                      <p>No products found for "{query}"</p>
                      <p className="no-results-hint">
                        Try searching with an 8-digit HS Code (e.g. 84713010) or a broader keyword
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="quick-chips">
            <span>Quick lookup:</span>
            {recommendationChips.map((chip) => (
              <button key={chip.code} className="chip-btn" onClick={() => handleChipClick(chip.code)}>
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPortal;
