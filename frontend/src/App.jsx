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

  return (
    <div className="app-container">
      {/* Global Header Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user}
        onLogout={handleLogout}
        setAuthViewOpen={setAuthViewOpen}
      />

      {/* Main Panel View Area */}
      <main className="main-content">
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
      </main>

      {/* Sliding login/signup form modal */}
      {authViewOpen && (
        <AuthForm
          apiBaseUrl={apiBaseUrl}
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setAuthViewOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
