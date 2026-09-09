import React, { useState, useEffect } from 'react';

const Watchlist = ({ apiBaseUrl, onSelectProduct, setActiveTab, user, onWatchlistChange }) => {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== HEURISTIC #3: Confirmation Dialog State (User Control & Freedom) =====
  const [confirmRemove, setConfirmRemove] = useState(null); // holds product to confirm removal

  // ===== HEURISTIC #3: Toast Notification with Undo (User Control & Freedom) =====
  const [toast, setToast] = useState(null);
  const [toastExiting, setToastExiting] = useState(false);

  const fetchWatchlist = async () => {
    const token = localStorage.getItem('trade_portal_token');
    if (!token) {
      setError('auth');
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
        throw new Error('network');
      }

      const data = await res.json();
      setWatchlistItems(data);
      setError(null);
    } catch (err) {
      setError(err.message === 'network' ? 'network' : 'network');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, [user]);

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const dismissToast = () => {
    setToastExiting(true);
    setTimeout(() => {
      setToast(null);
      setToastExiting(false);
    }, 300);
  };

  // ===== HEURISTIC #3: Confirm before removing (User Control & Freedom) =====
  const handleRemoveClick = (product, e) => {
    e.stopPropagation();
    setConfirmRemove(product); // Show confirmation dialog
  };

  const handleConfirmRemove = async () => {
    if (!confirmRemove) return;
    const code = confirmRemove.code;
    const removedProduct = confirmRemove;
    setConfirmRemove(null);

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

        // ===== HEURISTIC #3: Show toast with Undo option =====
        setToast({
          message: `"HS ${code}" removed from watchlist`,
          product: removedProduct,
          previousWatchlist: [...data.watchlist, code] // For undo
        });
      } else {
        setToast({ message: data.message || 'Failed to remove product.', isError: true });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Network error. Please try again.', isError: true });
    }
  };

  // ===== HEURISTIC #3: Undo removal (User Control & Freedom) =====
  const handleUndo = async () => {
    if (!toast?.product) return;
    const token = localStorage.getItem('trade_portal_token');

    try {
      const res = await fetch(`${apiBaseUrl}/api/tariffs/watchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: toast.product.code })
      });

      const data = await res.json();
      if (res.ok) {
        setWatchlistItems(prev => [...prev, toast.product]);
        onWatchlistChange(data.watchlist);
        dismissToast();
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
        {/* ===== HEURISTIC #1: Skeleton Loading State (Visibility of System Status) ===== */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {[1, 2, 3].map(idx => (
            <div key={idx} className="skeleton-loader" style={{ height: '200px' }}></div>
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

      {/* ===== HEURISTIC #9: Enhanced Error Recovery (Help Users Recognize, Diagnose, Recover) ===== */}
      {error === 'auth' && (
        <div className="error-recovery-card">
          <div className="error-icon">🔐</div>
          <h3>Authentication Required</h3>
          <p>You need to sign in to view and manage your personal watchlist. Your bookmarked HS codes and tariff data will be available once logged in.</p>
          <div className="recovery-actions">
            <button className="btn-primary" onClick={() => setActiveTab('dashboard')}>
              Browse as Guest
            </button>
          </div>
        </div>
      )}

      {error === 'network' && (
        <div className="error-recovery-card">
          <div className="error-icon">⚠️</div>
          <h3>Unable to Load Watchlist</h3>
          <p>We couldn't connect to the server. This may be due to a network issue or the server may be temporarily unavailable.</p>
          <div className="recovery-actions">
            <button className="btn-primary" onClick={fetchWatchlist}>
              🔄 Retry
            </button>
            <button className="btn-secondary" onClick={() => setActiveTab('dashboard')}>
              Go to Home
            </button>
          </div>
        </div>
      )}

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
        !error && (
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
                    onClick={(e) => handleRemoveClick(p, e)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ===== HEURISTIC #3: Confirmation Dialog Before Destructive Action ===== */}
      {confirmRemove && (
        <div className="confirm-dialog-overlay" onClick={(e) => e.target === e.currentTarget && setConfirmRemove(null)}>
          <div className="confirm-dialog">
            <div className="confirm-dialog-header">
              <span className="dialog-icon">⚠️</span>
              <h3>Remove from Watchlist?</h3>
            </div>
            <div className="confirm-dialog-body">
              Are you sure you want to remove <strong>HS {confirmRemove.code}</strong> — "{confirmRemove.description}" from your watchlist? You can always re-add it later from the search portal.
            </div>
            <div className="confirm-dialog-actions">
              <button className="btn-cancel" onClick={() => setConfirmRemove(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleConfirmRemove}>
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== HEURISTIC #3: Toast Notification with Undo ===== */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toastExiting ? 'toast-exit' : ''}`}>
            <span className="toast-message">{toast.message}</span>
            {toast.product && !toast.isError && (
              <button className="toast-undo-btn" onClick={handleUndo}>
                Undo
              </button>
            )}
            <button className="toast-close-btn" onClick={dismissToast}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
