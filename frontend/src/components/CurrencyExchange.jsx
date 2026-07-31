import React, { useState, useEffect } from 'react';

const CurrencyExchange = ({ apiBaseUrl }) => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');
  const [inrAmount, setInrAmount] = useState('100000');
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [targetAmount, setTargetAmount] = useState('');

  const currencyMeta = {
    USD: { name: 'US Dollar', symbol: '$', trend: 'up' },
    EUR: { name: 'Euro', symbol: '€', trend: 'down' },
    GBP: { name: 'Pound Sterling', symbol: '£', trend: 'up' },
    JPY: { name: 'Japanese Yen', symbol: '¥', trend: 'up' },
    AED: { name: 'UAE Dirham', symbol: 'د.إ', trend: 'down' },
    CNY: { name: 'Chinese Yuan', symbol: '¥', trend: 'down' },
    SGD: { name: 'Singapore Dollar', symbol: 'S$', trend: 'up' },
    AUD: { name: 'Australian Dollar', symbol: 'A$', trend: 'up' },
    CAD: { name: 'Canadian Dollar', symbol: 'C$', trend: 'down' },
  };

  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/api/currency/rates`);
      if (!res.ok) throw new Error('Failed to retrieve currency rates.');
      const data = await res.json();
      setRates(data.rates);
      setProvider(data.provider);
      setLastUpdate(data.time_last_update);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRates(); }, []);

  useEffect(() => {
    if (rates[targetCurrency] && inrAmount) {
      const calc = parseFloat(inrAmount) * rates[targetCurrency];
      setTargetAmount(calc.toFixed(2));
    } else {
      setTargetAmount('');
    }
  }, [inrAmount, targetCurrency, rates]);

  return (
    <div className="fade-in">
      <div className="flex-between" style={{ marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--navy-blue)' }}>
            💱 Live Currency Exchange Rates
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Indian Rupee (INR) conversion rates for major trade partner currencies
          </p>
        </div>
        <button className="btn-secondary" onClick={fetchRates} disabled={loading}>
          {loading ? 'Refreshing...' : '🔄 Refresh Rates'}
        </button>
      </div>

      <div className="currency-grid">
        {/* Rates Table */}
        <div className="card">
          <div className="card-header flex-between">
            <span>INR Exchange Value (1 Rupee =)</span>
            <span style={{ fontSize: '0.72rem', fontWeight: '400' }}>Source: {provider}</span>
          </div>
          <div className="card-body" style={{ padding: '0' }}>
            {error && <div className="alert-box danger" style={{ margin: '12px' }}>{error}</div>}

            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Loading rates...</div>
            ) : (
              Object.keys(rates).map((cur) => {
                const meta = currencyMeta[cur] || { name: cur, symbol: cur, trend: 'up' };
                const rateVal = rates[cur];
                const inverseRate = (1 / rateVal).toFixed(2);
                return (
                  <div key={cur} className="currency-row">
                    <div className="currency-info">
                      <div className="currency-flag-box">{cur}</div>
                      <div>
                        <div className="currency-name">{meta.name} ({cur})</div>
                        <div className="currency-full">1 {cur} = ₹{inverseRate} INR</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="currency-rate">{meta.symbol}{rateVal.toFixed(5)}</div>
                      <div className={meta.trend === 'up' ? 'trend-up' : 'trend-down'}>
                        {meta.trend === 'up' ? '▲ +0.12%' : '▼ -0.08%'}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div style={{ padding: '10px 16px', fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'right', borderTop: '1px solid var(--border-light)' }}>
            Last updated: {lastUpdate}
          </div>
        </div>

        {/* Converter */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '70px' }}>
            <div className="card-header">🧮 Invoice Exchange Calculator</div>
            <div className="card-body">
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Convert Indian Rupee export invoice values to quote overseas buyers.
              </p>

              <div className="form-group">
                <label>Amount in INR (₹)</label>
                <div className="input-with-addon">
                  <span className="input-addon">₹</span>
                  <input
                    type="text"
                    placeholder="Enter amount"
                    value={inrAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^\d*\.?\d*$/.test(val)) setInrAmount(val);
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Convert To</label>
                <div className="input-with-addon">
                  <select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)}>
                    {Object.keys(rates).map((cur) => (
                      <option key={cur} value={cur}>{cur} - {currencyMeta[cur]?.name || cur}</option>
                    ))}
                  </select>
                </div>
              </div>

              {!loading && rates[targetCurrency] && (
                <div style={{ background: 'var(--bg-light)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                  <div className="flex-between" style={{ fontSize: '0.82rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Base Rate:</span>
                    <span style={{ color: 'var(--text-body)', fontWeight: '500' }}>1 INR = {rates[targetCurrency].toFixed(6)} {targetCurrency}</span>
                  </div>
                  <div className="flex-between" style={{ fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Inverse:</span>
                    <span style={{ color: 'var(--text-body)', fontWeight: '500' }}>1 {targetCurrency} = {(1 / rates[targetCurrency]).toFixed(4)} INR</span>
                  </div>
                  <div className="calc-result-row">
                    <span className="calc-result-label">Converted Amount</span>
                    <span className="calc-result-val">
                      {currencyMeta[targetCurrency]?.symbol || ''}{' '}
                      {parseFloat(targetAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                      {targetCurrency}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyExchange;
