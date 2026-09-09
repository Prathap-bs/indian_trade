import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TradeGuidelines from './components/TradeGuidelines';
import CurrencyExchange from './components/CurrencyExchange';
import Watchlist from './components/Watchlist';
import AuthForm from './components/AuthForm';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [authViewOpen, setAuthViewOpen] = useState(false);
  const [selectedProductFromGuidelines, setSelectedProductFromGuidelines] = useState(null);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  const apiBaseUrl = 'http://localhost:5000';

  // Read session on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('trade_portal_user');
    const savedToken = localStorage.getItem('trade_portal_token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Session parsing error:', err);
      }
    }
  }, []);

  const handleGoToHome = () => {
    setSelectedProductFromGuidelines(null);
    setActiveTab('dashboard');
  };

  const handleGoToSearch = () => {
    setSelectedProductFromGuidelines(null);
    setActiveTab('dashboard');
    setTimeout(() => {
      const searchInput = document.querySelector('.search-input-field');
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // ===== HEURISTIC #7: Keyboard Shortcuts for Power Users (Flexibility & Efficiency of Use) =====
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when user is typing in an input/textarea
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      // Alt+1 = Home/Dashboard
      if (e.altKey && e.key === '1') { e.preventDefault(); handleGoToHome(); }
      // Alt+2 = Trade Guidelines
      if (e.altKey && e.key === '2') { e.preventDefault(); setActiveTab('guidelines'); }
      // Alt+3 = Exchange Rates
      if (e.altKey && e.key === '3') { e.preventDefault(); setActiveTab('currency'); }
      // Alt+4 = Watchlist
      if (e.altKey && e.key === '4') { e.preventDefault(); if (user) setActiveTab('watchlist'); }
      // Ctrl+K = Focus search input
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handleGoToSearch();
      }
      // ? = Show keyboard shortcuts help
      if (e.key === '?' && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setShowShortcutsHelp(true);
      }
      // Escape = Close shortcuts help
      if (e.key === 'Escape') {
        setShowShortcutsHelp(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user]);

  const handleLoginSuccess = (userData) => {
    setUser({
      id: userData._id,
      name: userData.name,
      email: userData.email,
      watchlist: userData.watchlist || [],
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('trade_portal_token');
    localStorage.removeItem('trade_portal_user');
    setUser(null);
    setActiveTab('dashboard');
  };

  // Sync user watchlist changes
  const handleWatchlistChange = (newWatchlist) => {
    const updated = { ...user, watchlist: newWatchlist };
    setUser(updated);
    localStorage.setItem('trade_portal_user', JSON.stringify(updated));
  };

  // Callback to search a specific HS code directly from guidelines library
  const handleSearchCodeFromGuidelines = async (code) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/tariffs/detail/${code}`);
      if (res.ok) {
        const product = await res.json();
        // Set the active product so Dashboard loads it immediately
        setSelectedProductFromGuidelines(product);
        setActiveTab('dashboard');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ===== HEURISTIC #1: Breadcrumb labels (Visibility of System Status) =====
  const breadcrumbMap = {
    dashboard: { icon: '🏠', label: 'Home & Tariff Search' },
    guidelines: { icon: '📋', label: 'Trade Guidelines Library' },
    currency: { icon: '💱', label: 'Currency Exchange Rates' },
    watchlist: { icon: '⭐', label: 'My Watchlist' },
  };

  const currentBreadcrumb = breadcrumbMap[activeTab] || breadcrumbMap.dashboard;

  return (
    <div className="app-container">
      {/* Global Header Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user}
        onLogout={handleLogout}
        setAuthViewOpen={setAuthViewOpen}
        onGoToHome={handleGoToHome}
        onGoToSearch={handleGoToSearch}
      />

      {/* ===== HEURISTIC #1: Breadcrumb Navigation (Visibility of System Status) ===== */}
      <div className="main-content">
        <nav className="breadcrumb-bar" aria-label="Breadcrumb">
          <span className="breadcrumb-item">🏛️ Indian Trade Portal</span>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-item active">
            {currentBreadcrumb.icon} {currentBreadcrumb.label}
          </span>
        </nav>

        {/* Main Panel View Area */}
        {activeTab === 'dashboard' && (
          <Dashboard
            apiBaseUrl={apiBaseUrl}
            user={user}
            onWatchlistChange={handleWatchlistChange}
            setAuthViewOpen={setAuthViewOpen}
            setActiveTab={setActiveTab}
            // Passing pre-selected product if it was queried from guidelines
            key={selectedProductFromGuidelines ? selectedProductFromGuidelines.code : 'default'}
            initialSelectedProduct={selectedProductFromGuidelines}
          />
        )}

        {activeTab === 'guidelines' && (
          <TradeGuidelines 
            onSearchCode={handleSearchCodeFromGuidelines} 
          />
        )}

        {activeTab === 'currency' && (
          <CurrencyExchange 
            apiBaseUrl={apiBaseUrl} 
          />
        )}

        {activeTab === 'watchlist' && (
          <Watchlist
            apiBaseUrl={apiBaseUrl}
            onSelectProduct={setSelectedProductFromGuidelines}
            setActiveTab={setActiveTab}
            user={user}
            onWatchlistChange={handleWatchlistChange}
          />
        )}
      </div>

      {/* ===== HEURISTIC #10: Government Footer with Help & Documentation ===== */}
      <footer className="govt-footer">
        <div className="footer-grid">
          <div className="footer-section">
            <h4>About the Portal</h4>
            <p>
              The Indian Trade Portal is a single-window digital platform by the Ministry of Commerce & Industry, 
              Government of India, providing exporters and importers access to tariff information, trade guidelines, 
              regulatory compliance data, and export incentive schemes under the Foreign Trade Policy 2023–2028.
            </p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="https://dgft.gov.in" target="_blank" rel="noopener noreferrer">DGFT Portal</a>
            <a href="https://cbic.gov.in" target="_blank" rel="noopener noreferrer">CBIC / Customs</a>
            <a href="https://icegate.gov.in" target="_blank" rel="noopener noreferrer">ICEGATE</a>
            <a href="https://fieo.org" target="_blank" rel="noopener noreferrer">FIEO</a>
            <a href="https://apeda.gov.in" target="_blank" rel="noopener noreferrer">APEDA</a>
          </div>
          <div className="footer-section">
            <h4>Help & Support</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowShortcutsHelp(true); }}>⌨️ Keyboard Shortcuts</a>
            <a href="https://commerce.gov.in" target="_blank" rel="noopener noreferrer">📖 Trade FAQ</a>
            <a href="https://commerce.gov.in" target="_blank" rel="noopener noreferrer">📧 Contact Support</a>
            <a href="https://commerce.gov.in" target="_blank" rel="noopener noreferrer">📋 User Guide</a>
            <a href="https://commerce.gov.in" target="_blank" rel="noopener noreferrer">♿ Accessibility</a>
          </div>
          <div className="footer-section">
            <h4>Policies</h4>
            <a href="#">Terms of Use</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Copyright Policy</a>
            <a href="#">Disclaimer</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Ministry of Commerce & Industry, Government of India. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="footer-tricolor">
              <span className="fc-saffron"></span>
              <span className="fc-white"></span>
              <span className="fc-green"></span>
            </div>
            <p>Designed & Developed under Digital India Initiative</p>
          </div>
        </div>
      </footer>

      {/* Sliding login/signup form modal */}
      {authViewOpen && (
        <AuthForm
          apiBaseUrl={apiBaseUrl}
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setAuthViewOpen(false)}
        />
      )}

      {/* ===== HEURISTIC #7: Keyboard Shortcuts Help Panel (Flexibility & Efficiency of Use) ===== */}
      {showShortcutsHelp && (
        <div className="shortcuts-help-panel" onClick={(e) => e.target === e.currentTarget && setShowShortcutsHelp(false)}>
          <div className="shortcuts-help-card">
            <div className="shortcuts-header">
              <h3>⌨️ Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcutsHelp(false)}>✕</button>
            </div>
            <div className="shortcuts-list">
              <div className="shortcut-row">
                <span className="shortcut-label">Go to Home / Dashboard</span>
                <div className="shortcut-keys"><kbd>Alt</kbd><kbd>1</kbd></div>
              </div>
              <div className="shortcut-row">
                <span className="shortcut-label">Go to Trade Guidelines</span>
                <div className="shortcut-keys"><kbd>Alt</kbd><kbd>2</kbd></div>
              </div>
              <div className="shortcut-row">
                <span className="shortcut-label">Go to Currency Exchange</span>
                <div className="shortcut-keys"><kbd>Alt</kbd><kbd>3</kbd></div>
              </div>
              <div className="shortcut-row">
                <span className="shortcut-label">Go to My Watchlist</span>
                <div className="shortcut-keys"><kbd>Alt</kbd><kbd>4</kbd></div>
              </div>
              <div className="shortcut-row">
                <span className="shortcut-label">Focus Search Input</span>
                <div className="shortcut-keys"><kbd>Ctrl</kbd><kbd>K</kbd></div>
              </div>
              <div className="shortcut-row">
                <span className="shortcut-label">Show This Help Panel</span>
                <div className="shortcut-keys"><kbd>?</kbd></div>
              </div>
              <div className="shortcut-row">
                <span className="shortcut-label">Close Dialog / Panel</span>
                <div className="shortcut-keys"><kbd>Esc</kbd></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
