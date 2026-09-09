import React, { useState, useEffect } from 'react';

const Navbar = ({ activeTab, setActiveTab, user, onLogout, setAuthViewOpen, onGoToHome, onGoToSearch }) => {
  const handleHomeClick = () => {
    if (onGoToHome) {
      onGoToHome();
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleSearchClick = () => {
    if (onGoToSearch) {
      onGoToSearch();
    } else {
      setActiveTab('dashboard');
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input-field');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  return (
    <>
      {/* Tricolor Strip */}
      <div className="tricolor-strip">
        <div className="saffron"></div>
        <div className="white-strip"></div>
        <div className="green-strip"></div>
      </div>

      {/* Government Top Bar */}
      <div className="govt-topbar">
        <div>
          <a href="#main-content" className="skip-nav">Skip to Main Content</a>
          <a href="#">Screen Reader Access</a>
        </div>
        <div>
          <span>Government of India</span>
          <a href="#">हिंदी</a>
          <a href="#" aria-label="Increase font size">A+</a>
          <a href="#" aria-label="Reset font size">A</a>
          <a href="#" aria-label="Decrease font size">A-</a>
        </div>
      </div>

      {/* Main Header with Emblem */}
      <div className="main-header">
        <div className="header-left">
          <img src="/images/ashoka_emblem.png" alt="National Emblem of India" className="emblem-img" />
          <div className="header-title-block">
            <div className="org-name">Ministry of Commerce &amp; Industry</div>
            <h1>Indian Trade Portal</h1>
            <div className="subtitle">
              Department of Commerce | Federation of Indian Export Organisations
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="leader-portraits">
            <div className="leader-card">
              <img src="/images/pm_modi.png" alt="Shri Narendra Modi" />
              <div className="leader-info">
                <span className="leader-name">Shri Narendra Modi</span>
                <span className="leader-title">Hon'ble Prime Minister</span>
              </div>
            </div>
            <div className="leader-card">
              <img src="/images/piyush_goyal.png" alt="Shri Piyush Goyal" />
              <div className="leader-info">
                <span className="leader-name">Shri Piyush Goyal</span>
                <span className="leader-title">Hon'ble Commerce Minister</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar — HEURISTIC #1: aria-current for Visibility of System Status */}
      <nav className="nav-bar" role="navigation" aria-label="Main Navigation">
        <ul>
          <li>
            {/* HEURISTIC #1: aria-current indicates the active page to screen readers */}
            <button
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={handleHomeClick}
              aria-current={activeTab === 'dashboard' ? 'page' : undefined}
            >
              🏠 Home
              {/* HEURISTIC #7: Keyboard shortcut badge for power users */}
              <span className="kbd-badge">Alt+1</span>
            </button>
          </li>
          <li>
            <button
              className={activeTab === 'dashboard' ? '' : ''}
              onClick={handleSearchClick}
            >
              🔍 Tariff Search
              <span className="kbd-badge">Ctrl+K</span>
            </button>
          </li>
          <li>
            <button
              className={activeTab === 'guidelines' ? 'active' : ''}
              onClick={() => setActiveTab('guidelines')}
              aria-current={activeTab === 'guidelines' ? 'page' : undefined}
            >
              📋 Trade Guidelines
              <span className="kbd-badge">Alt+2</span>
            </button>
          </li>
          <li>
            <button
              className={activeTab === 'currency' ? 'active' : ''}
              onClick={() => setActiveTab('currency')}
              aria-current={activeTab === 'currency' ? 'page' : undefined}
            >
              💱 Exchange Rates
              <span className="kbd-badge">Alt+3</span>
            </button>
          </li>
          {user && (
            <li>
              <button
                className={activeTab === 'watchlist' ? 'active' : ''}
                onClick={() => setActiveTab('watchlist')}
                aria-current={activeTab === 'watchlist' ? 'page' : undefined}
              >
                ⭐ My Watchlist
                <span className="kbd-badge">Alt+4</span>
              </button>
            </li>
          )}
        </ul>

        <div className="nav-auth-area">
          {user ? (
            <>
              <span className="user-greeting">
                Welcome, <strong>{user.name}</strong>
              </span>
              <button className="btn-logout-nav" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <button className="btn-login-nav" onClick={() => setAuthViewOpen(true)}>
              Login / Register
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
