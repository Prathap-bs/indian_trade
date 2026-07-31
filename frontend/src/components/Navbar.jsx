import React, { useState, useEffect } from 'react';

const Navbar = ({ activeTab, setActiveTab, user, onLogout, setAuthViewOpen }) => {
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
          <a href="#" className="skip-nav">Skip to Main Content</a>
          <a href="#">Screen Reader Access</a>
        </div>
        <div>
          <span>Government of India</span>
          <a href="#">हिंदी</a>
          <a href="#">A+</a>
          <a href="#">A</a>
          <a href="#">A-</a>
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

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <ul>
          <li>
            <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
              🏠 Home
            </button>
          </li>
          <li>
            <button className={activeTab === 'dashboard' ? '' : ''} onClick={() => setActiveTab('dashboard')}>
              🔍 Tariff Search
            </button>
          </li>
          <li>
            <button className={activeTab === 'guidelines' ? 'active' : ''} onClick={() => setActiveTab('guidelines')}>
              📋 Trade Guidelines
            </button>
          </li>
          <li>
            <button className={activeTab === 'currency' ? 'active' : ''} onClick={() => setActiveTab('currency')}>
              💱 Exchange Rates
            </button>
          </li>
          {user && (
            <li>
              <button className={activeTab === 'watchlist' ? 'active' : ''} onClick={() => setActiveTab('watchlist')}>
                ⭐ My Watchlist
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
