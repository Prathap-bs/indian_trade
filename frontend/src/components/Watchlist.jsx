import React, { useState, useEffect } from 'react';

const Watchlist = ({ apiBaseUrl, onSelectProduct, setActiveTab, user, onWatchlistChange }) => {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWatchlist = async () => {
    const token = localStorage.getItem('trade_portal_token');
    if (!token) {
      setError('Please sign in to view your watchlist.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/api/tariffs/watchlist`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to retrieve watchlist data.');
      }

      const data = await res.json();
      setWatchlistItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, [user]);

  const handleRemove = async (code, e) => {
    e.stopPropagation(); // Avoid triggering full product select card action
    const token = localStorage.getItem('trade_portal_token');

    try {
      const res = await fetch(`${apiBaseUrl}/api/tariffs/watchlist/${code}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        // Remove item from local rendering list
        setWatchlistItems(watchlistItems.filter(item => item.code !== code));
        onWatchlistChange(data.watchlist);
      } else {
        alert(data.message || 'Failed to remove product from watchlist.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCardClick = (product) => {
    onSelectProduct(product);
    setActiveTab('dashboard');
  };

  if (loading) {
    return (
      <div className="search-results-section">
        <h1 className="hero-title" style={{ fontSize: '2.2rem', textAlign: 'left', marginBottom: '30px' }}>
          My Watchlist
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {[1, 2, 3].map(idx => (
            <div key={idx} style={{ height: '200px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', animation: 'pulse 1.5s infinite' }}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-section">
      <div className="detail-header" style={{ marginBottom: '10px' }}>
        <div className="detail-titles">
          <h1 className="hero-title" style={{ fontSize: '2.4rem', textAlign: 'left', marginBottom: '4px' }}>
            My Watchlist
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1rem', textAlign: 'left', marginBottom: '30px' }}>
            Track and monitor import policies, tax adjustments, and rules for your bookmarked items.
          </p>
        </div>
      </div>

      {error && <div className="alert-box danger">{error}</div>}

      {!error && watchlistItems.length === 0 ? (
        <div className="card-wrapper text-center" style={{ padding: '60px 40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>☆</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>Your watchlist is empty</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
            Bookmark products from the search portal to easily monitor their details here.
          </p>
          <button className="btn-primary" onClick={() => setActiveTab('dashboard')}>
            Go to Search Portal
          </button>
        </div>
      ) : (
        <div className="watchlist-container">
          {watchlistItems.map((p) => (
            <div 
              key={p.code} 
              className="card-wrapper watchlist-card"
              onClick={() => handleCardClick(p)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div className="watchlist-header">
                  <span className="badge badge-code">HS {p.code}</span>
                  <span className={`badge badge-policy ${p.importPolicy.toLowerCase()}`}>
                    {p.importPolicy}
                  </span>
                </div>

                <h3 className="card-title-link" style={{ marginBottom: '8px', lineHeight: '1.4' }}>
                  {p.description}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {p.category} &bull; {p.industry}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: 'var(--bg-light)', border: '1px solid var(--border-light)', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>BCD</span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--navy-blue)' }}>{p.tariffs?.bcd}%</strong>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>GST</span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--navy-blue)' }}>{p.tariffs?.igst}%</strong>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Rebates</span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--green-india)' }}>
                      {((p.exportIncentives?.rodtep || 0) + (p.exportIncentives?.drawback || 0)).toFixed(1)}%
                    </strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  className="btn-primary" 
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem', justifyContent: 'center' }}
                  onClick={() => handleCardClick(p)}
                >
                  View Details
                </button>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '8px 12px', fontSize: '0.8rem', color: 'var(--accent-red)' }}
                  onClick={(e) => handleRemove(p.code, e)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
