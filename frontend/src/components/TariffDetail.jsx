import React, { useState, useEffect } from 'react';

const TariffDetail = ({ product, user, apiBaseUrl, onWatchlistChange, setAuthViewOpen }) => {
  const [activeTab, setActiveTab] = useState('tariffs');
  const [cargoValue, setCargoValue] = useState('1000000');
  const [isImport, setIsImport] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    if (user && user.watchlist) {
      setInWatchlist(user.watchlist.includes(product.code));
    } else {
      setInWatchlist(false);
    }
  }, [user, product]);

  const handleWatchlistToggle = async () => {
    if (!user) {
      setAuthViewOpen(true);
      return;
    }
    setWatchlistLoading(true);
    const token = localStorage.getItem('trade_portal_token');
    const method = inWatchlist ? 'DELETE' : 'POST';
    const url = inWatchlist
      ? `${apiBaseUrl}/api/tariffs/watchlist/${product.code}`
      : `${apiBaseUrl}/api/tariffs/watchlist`;
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: inWatchlist ? null : JSON.stringify({ code: product.code }),
      });
      const data = await res.json();
      if (res.ok) {
        setInWatchlist(!inWatchlist);
        onWatchlistChange(data.watchlist);
      }
    } catch (err) { console.error(err); }
    finally { setWatchlistLoading(false); }
  };

  const calculateDuties = () => {
    const value = parseFloat(cargoValue) || 0;
    const bcdRate = product.tariffs?.bcd || 0;
    const swsRate = product.tariffs?.sws || 0;
    const igstRate = product.tariffs?.igst || 0;
    const bcd = value * (bcdRate / 100);
    const sws = bcd * (swsRate / 100);
    const subtotal = value + bcd + sws;
    const igst = subtotal * (igstRate / 100);
    const totalDuties = bcd + sws + igst;
    const landedCost = value + totalDuties;
    const rodtepRate = product.exportIncentives?.rodtep || 0;
    const drawbackRate = product.exportIncentives?.drawback || 0;
    const rodtep = value * (rodtepRate / 100);
    const drawback = value * (drawbackRate / 100);
    const totalIncentives = rodtep + drawback;
    return { bcd, sws, igst, totalDuties, landedCost, rodtep, drawback, totalIncentives };
  };

  const results = calculateDuties();

  return (
    <div className="fade-in">
      {/* Product Summary */}
      <div className="detail-header">
        <div>
          <div className="detail-badge-row">
            <span className="badge badge-code">HS {product.code}</span>
            <span className={`badge badge-policy ${product.importPolicy?.toLowerCase()}`}>
              {product.importPolicy}
            </span>
            <span className="badge" style={{ background: '#f5f5f5', color: '#666' }}>{product.category}</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginTop: '10px', color: 'var(--navy-blue)' }}>
            {product.description}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Industry: {product.industry} &bull; Import Policy: {product.importPolicy}
          </p>
        </div>
        <button
          className={inWatchlist ? 'btn-saffron' : 'btn-secondary'}
          onClick={handleWatchlistToggle}
          disabled={watchlistLoading}
        >
          {watchlistLoading ? 'Updating...' : inWatchlist ? '★ Bookmarked' : '☆ Add to Watchlist'}
        </button>
      </div>

      {product.recentChange && (
        <div className="alert-box info">
          <strong>📌 Policy Update:</strong> {product.recentChange}
        </div>
      )}

      {/* Main Grid */}
      <div className="detail-main-layout">
        {/* Left: Information Panels */}
        <div>
          {/* Policy Card */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-header">📋 Import / Export Conditions</div>
            <div className="card-body">
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '2px' }}>
                  Import Policy Clause:
                </strong>
                <span style={{ fontSize: '0.9rem' }}>{product.policyConditions}</span>
              </div>
              <div>
                <strong style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '2px' }}>
                  Export Benefits:
                </strong>
                <span style={{ fontSize: '0.9rem' }}>{product.exportIncentives?.otherIncentive}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="detail-tabs-menu">
            {[
              { key: 'tariffs', label: 'MFN Tariffs' },
              { key: 'preferential', label: 'FTA Preferential Rates' },
              { key: 'sps', label: 'SPS/TBT Compliance' },
              { key: 'rules', label: 'Rules of Origin' },
            ].map((t) => (
              <button
                key={t.key}
                className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="tab-content-panel fade-in">
            {activeTab === 'tariffs' && (
              <div>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '14px' }}>
                  Standard Most Favoured Nation (MFN) rates applicable to WTO member countries:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[
                    { label: 'Basic Customs Duty (BCD)', value: `${product.tariffs?.bcd?.toFixed(1)}%` },
                    { label: 'Social Welfare Surcharge', value: `${product.tariffs?.sws?.toFixed(1)}% of BCD` },
                    { label: 'Integrated GST (IGST)', value: `${product.tariffs?.igst?.toFixed(1)}%` },
                  ].map((item, idx) => (
                    <div key={idx} className="card" style={{ textAlign: 'center' }}>
                      <div className="card-body" style={{ padding: '14px' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{item.label}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--navy-blue)' }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'preferential' && (
              <div>
                {product.preferentialTariffs?.length > 0 ? (
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '12px' }}>
                      Reduced duty rates under active Free Trade Agreements. Certificate of Origin required.
                    </p>
                    {product.preferentialTariffs.map((fta, idx) => (
                      <div key={idx} className="card" style={{ marginBottom: '8px' }}>
                        <div className="card-body flex-between">
                          <div>
                            <strong style={{ color: 'var(--navy-blue)' }}>{fta.agreement}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Partner: {fta.partnerCountry}</div>
                          </div>
                          <span style={{ fontWeight: '700', color: 'var(--green-india)', fontSize: '1.1rem' }}>
                            {fta.rate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card">
                    <div className="card-body text-center" style={{ padding: '24px', color: '#999' }}>
                      No preferential agreements apply. Standard MFN rates are applicable.
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sps' && (
              <div>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '12px' }}>
                  Regulatory compliance measures for customs clearance in India:
                </p>
                {product.spsTbtMeasures?.length > 0 ? (
                  product.spsTbtMeasures.map((m, idx) => (
                    <div key={idx} className="card" style={{ marginBottom: '10px' }}>
                      <div className="card-body">
                        <div className="flex-between" style={{ marginBottom: '6px' }}>
                          <span className="badge" style={{
                            background: m.measureType === 'SPS' ? 'var(--light-blue)' : '#f1f5f9',
                            color: m.measureType === 'SPS' ? 'var(--green-india)' : 'var(--navy-blue)',
                          }}>
                            {m.measureType} Measure
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                            Agency: {m.agency}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-body)' }}>{m.requirement}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="card">
                    <div className="card-body text-center" style={{ padding: '24px', color: '#999' }}>
                      No mandatory SPS/TBT certifications specified.
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="card">
                <div className="card-header">Rules of Origin Requirement</div>
                <div className="card-body">
                  <p style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>{product.rulesOfOrigin}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Duty Calculator */}
        <div>
          <div className="card duty-calc-card">
            <div className="card-header flex-between">
              <span>🧮 Duty & Claims Calculator</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  style={{
                    padding: '3px 10px', fontSize: '0.72rem', border: 'none', borderRadius: '3px',
                    background: isImport ? 'var(--saffron)' : 'rgba(255,255,255,0.2)', color: '#fff',
                    cursor: 'pointer', fontWeight: '600',
                  }}
                  onClick={() => setIsImport(true)}
                >Import</button>
                <button
                  style={{
                    padding: '3px 10px', fontSize: '0.72rem', border: 'none', borderRadius: '3px',
                    background: !isImport ? 'var(--saffron)' : 'rgba(255,255,255,0.2)', color: '#fff',
                    cursor: 'pointer', fontWeight: '600',
                  }}
                  onClick={() => setIsImport(false)}
                >Export</button>
              </div>
            </div>
            <div className="card-body">
              <p style={{ fontSize: '0.78rem', color: '#666', marginBottom: '14px' }}>
                {isImport
                  ? 'Compute customs duties and landed cost based on CIF values.'
                  : 'Estimate claimable rebates under RoDTEP and Duty Drawback schemes.'}
              </p>

              <div className="form-group">
                <label>Cargo Valuation (INR)</label>
                <div className={`input-with-addon ${cargoValue && parseFloat(cargoValue) > 0 ? 'input-success' : cargoValue === '' ? '' : 'input-error'}`}>
                  <span className="input-addon">₹</span>
                  <input
                    type="text"
                    value={cargoValue}
                    aria-label="Enter cargo value in Indian Rupees"
                    placeholder="Enter cargo value (e.g. 1000000)"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^\d*\.?\d*$/.test(val)) setCargoValue(val);
                    }}
                  />
                </div>
                {/* ===== HEURISTIC #5: Input Validation Feedback (Error Prevention) ===== */}
                {cargoValue !== '' && parseFloat(cargoValue) > 0 && (
                  <div className="validation-hint valid">✓ Valid cargo value — duties will be calculated below</div>
                )}
                {cargoValue !== '' && (parseFloat(cargoValue) === 0 || isNaN(parseFloat(cargoValue))) && (
                  <div className="validation-hint invalid">⚠ Please enter a positive numeric value for accurate duty computation</div>
                )}
                {cargoValue === '' && (
                  <div className="validation-hint invalid">⚠ Cargo value is required to compute duty breakdown</div>
                )}
              </div>


              <div style={{ background: 'var(--bg-light)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '14px', marginTop: '8px' }}>
                {isImport ? (
                  <div>
                    <div className="duty-breakdown-row">
                      <span>Assessable Value:</span>
                      <span>₹{parseFloat(cargoValue || 0).toLocaleString()}</span>
                    </div>
                    <div className="duty-breakdown-row">
                      <span>BCD ({product.tariffs?.bcd}%):</span>
                      <span>₹{results.bcd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="duty-breakdown-row">
                      <span>SWS ({product.tariffs?.sws}% of BCD):</span>
                      <span>₹{results.sws.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="duty-breakdown-row">
                      <span>IGST ({product.tariffs?.igst}%):</span>
                      <span>₹{results.igst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="duty-breakdown-row total">
                      <span>Total Duties:</span>
                      <span style={{ color: 'var(--accent-red)' }}>
                        ₹{results.totalDuties.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="duty-breakdown-row total" style={{ borderTop: '1px dashed var(--border-medium)', marginTop: '6px', paddingTop: '8px' }}>
                      <span>Landed Cost:</span>
                      <span style={{ color: 'var(--navy-blue)' }}>
                        ₹{results.landedCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="duty-breakdown-row">
                      <span>FOB Export Value:</span>
                      <span>₹{parseFloat(cargoValue || 0).toLocaleString()}</span>
                    </div>
                    <div className="duty-breakdown-row">
                      <span>RoDTEP ({product.exportIncentives?.rodtep}%):</span>
                      <span>₹{results.rodtep.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="duty-breakdown-row">
                      <span>Duty Drawback ({product.exportIncentives?.drawback}%):</span>
                      <span>₹{results.drawback.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="duty-breakdown-row total">
                      <span>Total Claimable:</span>
                      <span style={{ color: 'var(--green-india)' }}>
                        ₹{results.totalIncentives.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TariffDetail;
