import React, { useState, useEffect, useRef } from 'react';

const SearchPortal = ({ apiBaseUrl, onSelectProduct }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
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
          }
        } catch (err) {
          console.error('Error fetching suggestions:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
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
          <h2>India's Single Window Trade Intelligence Portal</h2>
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
              />
              <button type="submit" className="search-button-inner">
                {loading ? '...' : 'Search'}
              </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="autocomplete-dropdown">
                {suggestions.map((p) => (
                  <div key={p.code} className="autocomplete-item" onClick={() => handleSuggestionClick(p)}>
                    <span className="autocomplete-code">{p.code}</span>
                    <span className="autocomplete-desc" title={p.description}>{p.description}</span>
                    <span className="autocomplete-cat">{p.category}</span>
                  </div>
                ))}
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
