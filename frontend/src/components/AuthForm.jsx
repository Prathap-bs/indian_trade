import React, { useState, useEffect } from 'react';

const AuthForm = ({ apiBaseUrl, onLoginSuccess, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [emailValid, setEmailValid] = useState(null); // null = not checked, true/false

  // ===== HEURISTIC #5: Real-time Email Validation (Error Prevention) =====
  useEffect(() => {
    if (!email) { setEmailValid(null); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    if (isLogin || !password) { setPasswordStrength(''); return; }
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    if (strength === 1) setPasswordStrength('weak');
    else if (strength === 2) setPasswordStrength('medium');
    else if (strength === 3) setPasswordStrength('strong');
  }, [password, isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null); setLoading(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { name, email, password };
    try {
      const res = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication failed.');
      setSuccess(isLogin ? 'Login successful!' : 'Account registered!');
      localStorage.setItem('trade_portal_token', data.token);
      localStorage.setItem('trade_portal_user', JSON.stringify({
        id: data._id, name: data.name, email: data.email, watchlist: data.watchlist || []
      }));
      setTimeout(() => { onLoginSuccess(data); onClose(); }, 800);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-container">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <h3>🏛️ Indian Trade Portal</h3>
          <p>Ministry of Commerce & Industry, Government of India</p>
        </div>

        {/* Tabs */}
        <div className="auth-header-tabs">
          <button className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(true); setError(null); }}>
            Sign In
          </button>
          <button className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(false); setError(null); }}>
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form-body">
          {error && <div className="alert-box danger">{error}</div>}
          {success && <div className="alert-box success">{success}</div>}

          {!isLogin && (
            <div className="input-block">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your name" required value={name}
                onChange={(e) => setName(e.target.value)} />
            </div>
          )}

          <div className="input-block">
            <label>Email Address / Username</label>
            <input
              type="email"
              placeholder="name@company.com"
              required
              value={email}
              className={email ? (emailValid ? 'input-success' : 'input-error') : ''}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* ===== HEURISTIC #5: Email Validation Hint (Error Prevention) ===== */}
            {email && emailValid && (
              <div className="validation-hint valid">✓ Valid email format</div>
            )}
            {email && emailValid === false && (
              <div className="validation-hint invalid">⚠ Please enter a valid email (e.g. name@company.com)</div>
            )}
          </div>

          <div className="input-block">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required value={password}
              onChange={(e) => setPassword(e.target.value)} />
            {!isLogin && password && (
              <div>
                <div className="password-strength-bar">
                  <div className={`password-strength-fill strength-${passwordStrength}`}></div>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  Strength: {passwordStrength || 'Too short'}
                </span>
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register Now'}
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {isLogin ? (
              <p>New exporter? <span style={{ color: 'var(--navy-blue)', cursor: 'pointer', fontWeight: '600' }}
                onClick={() => setIsLogin(false)}>Create an account</span></p>
            ) : (
              <p>Already registered? <span style={{ color: 'var(--navy-blue)', cursor: 'pointer', fontWeight: '600' }}
                onClick={() => setIsLogin(true)}>Sign in here</span></p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
