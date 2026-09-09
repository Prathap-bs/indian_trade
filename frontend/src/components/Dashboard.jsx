import React, { useState, useEffect } from 'react';
import SearchPortal from './SearchPortal';
import TariffDetail from './TariffDetail';

const Dashboard = ({ apiBaseUrl, user, onWatchlistChange, setAuthViewOpen, setActiveTab, initialSelectedProduct }) => {
  const [selectedProduct, setSelectedProduct] = useState(initialSelectedProduct || null);

  useEffect(() => {
    setSelectedProduct(initialSelectedProduct || null);
  }, [initialSelectedProduct]);

  const tradeBulletins = [
    {
      id: 'b1',
      date: '22 July 2026',
      tag: 'DGFT Notification',
      title: 'Import Policy Revised for IT Hardware (Laptops, Tablets)',
      summary: 'DGFT opens single-window authorization portal for automated laptop/tablet clearance. New CRO compliance norms apply from August 2026.',
    },
    {
      id: 'b2',
      date: '18 July 2026',
      tag: 'Export Scheme',
      title: 'RoSCTL Benefits Extended for Readymade Garments till 2027',
      summary: 'Ministry of Textiles confirms continuation of rebate percentages up to 6.05% for all knitted and woven textile export consignments.',
    },
    {
      id: 'b3',
      date: '10 July 2026',
      tag: 'Customs Update',
      title: 'ICEGATE Portal Integrates Real-Time API Verification',
      summary: 'Customs ICEGATE now supports real-time certificate verification for pharmaceutical compound exports. All exporters must register updated credentials.',
    },
    {
      id: 'b4',
      date: '05 July 2026',
      tag: 'FTA Alert',
      title: 'India-UAE CEPA: Updated Rules of Origin Guidelines Released',
      summary: 'Department of Commerce publishes revised origin certification procedures for preferential tariff claims under India-UAE CEPA.',
    },
  ];

  return (
    <div>
      {selectedProduct ? (
        <div className="fade-in">
          <button className="btn-secondary" style={{ marginBottom: '16px' }} onClick={() => setSelectedProduct(null)}>
            ← Back to Search
          </button>
          <TariffDetail
            product={selectedProduct}
            user={user}
            apiBaseUrl={apiBaseUrl}
            onWatchlistChange={onWatchlistChange}
            setAuthViewOpen={setAuthViewOpen}
          />
        </div>
      ) : (
        <div>
          <SearchPortal apiBaseUrl={apiBaseUrl} onSelectProduct={setSelectedProduct} />

          {/* Leaders Quote & Photos Banner */}
          <div className="leaders-banner" style={{ marginTop: '24px' }}>
            <div className="leaders-photos">
              <div className="leader-photo-card">
                <img src="/images/pm_modi.png" alt="Shri Narendra Modi" />
                <div className="name">Shri Narendra Modi</div>
                <div className="role">Hon'ble Prime Minister</div>
              </div>
              <div className="leader-photo-card">
                <img src="/images/piyush_goyal.png" alt="Shri Piyush Goyal" />
                <div className="name">Shri Piyush Goyal</div>
                <div className="role">Hon'ble Commerce Minister</div>
              </div>
            </div>
            <div className="leaders-text">
              <div className="quote">
                "India's trade policy aims to make the country a hub for global value chains and boost exports to USD 2 trillion by 2030."
              </div>
              <div className="attribution">
                — Government of India, Foreign Trade Policy 2023-2028
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="dashboard-grid">
            {/* Left: Trade Bulletins */}
            <div>
              <h2 className="section-heading">
                <span className="icon">📢</span> Latest Trade Notifications & Circulars
              </h2>
              {tradeBulletins.map((b) => (
                <div key={b.id} className="bulletin-card">
                  <div className="flex-between" style={{ marginBottom: '6px' }}>
                    <span className="bulletin-tag">{b.tag}</span>
                    <span className="bulletin-date">{b.date}</span>
                  </div>
                  <div className="bulletin-title">{b.title}</div>
                  <div className="bulletin-summary">{b.summary}</div>
                </div>
              ))}
            </div>

            {/* Right: Quick Stats Sidebar */}
            <div>
              <h2 className="section-heading">
                <span className="icon">💱</span> INR Exchange Rates
              </h2>
              <div className="card">
                <div className="card-header">Reserve Bank of India Reference Rates</div>
                <div className="card-body" style={{ padding: '0' }}>
                  {[
                    { code: 'USD', name: 'US Dollar', rate: '₹83.52' },
                    { code: 'EUR', name: 'Euro', rate: '₹90.10' },
                    { code: 'GBP', name: 'British Pound', rate: '₹106.40' },
                    { code: 'JPY', name: 'Japanese Yen (100)', rate: '₹53.18' },
                    { code: 'AED', name: 'UAE Dirham', rate: '₹22.74' },
                  ].map((c) => (
                    <div key={c.code} className="currency-sidebar-row">
                      <div>
                        <span className="currency-code">{c.code}</span>
                        <span style={{ fontSize: '0.78rem', color: '#999', marginLeft: '8px' }}>{c.name}</span>
                      </div>
                      <span className="currency-val">{c.rate}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
                onClick={() => setActiveTab('currency')}
              >
                View All Rates & Calculator →
              </button>

              {/* Quick Links Card */}
              <div style={{ marginTop: '24px' }}>
                <h2 className="section-heading">
                  <span className="icon">🔗</span> Important Links
                </h2>
                <div className="card">
                  <div className="card-body" style={{ padding: '0' }}>
                    {[
                      { label: 'Directorate General of Foreign Trade', url: 'https://dgft.gov.in' },
                      { label: 'Central Board of Indirect Taxes', url: 'https://cbic.gov.in' },
                      { label: 'FIEO - Federation of Indian Export Organisations', url: 'https://fieo.org' },
                      { label: 'Indian Customs ICEGATE', url: 'https://icegate.gov.in' },
                      { label: 'APEDA Export Portal', url: 'https://apeda.gov.in' },
                    ].map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'block',
                          padding: '10px 16px',
                          borderBottom: '1px solid #f0f0f0',
                          color: '#003366',
                          fontSize: '0.85rem',
                          textDecoration: 'none',
                          transition: 'background 0.15s',
                        }}
                        onMouseOver={(e) => e.target.style.background = '#f5f0e8'}
                        onMouseOut={(e) => e.target.style.background = 'none'}
                      >
                        🔹 {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
