import React, { useState } from 'react';

const TradeGuidelines = ({ onSearchCode }) => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const guidelinesData = [
    {
      id: 'g1',
      title: 'Import Authorization for IT Hardware & Electronics',
      type: 'Import Policy',
      agency: 'DGFT / BIS',
      hscode: '84713010',
      product: 'Laptops & Notebooks',
      description: 'Restricted category. Import requires valid licensing from the Directorate General of Foreign Trade (DGFT) and mandatory safety registration under Bureau of Indian Standards (BIS) CRO regulations.',
      steps: ['Apply for DGFT import authorization online.', 'Get BIS CRO registration under IS 13252.', 'Submit ICEGATE customs declaration with license keys.'],
    },
    {
      id: 'g2',
      title: 'Wireless Equipment Type Approval (ETA)',
      type: 'Certifications',
      agency: 'WPC / BIS',
      hscode: '85171300',
      product: 'Smartphones & RF Devices',
      description: 'Telecom and radio transmitters require frequency allocation clearance from Wireless Planning & Coordination (WPC). Equipment must operate on legal spectrums.',
      steps: ['Register on WPC Saral Sanchar portal.', 'Perform test clearance in accredited labs.', 'Acquire WPC Import License and WPC ETA certificate.'],
    },
    {
      id: 'g3',
      title: 'Pharmaceutical Formulations Registration & Licensing',
      type: 'Certifications',
      agency: 'CDSCO',
      hscode: '30049099',
      product: 'Medicaments & Tablets',
      description: 'Mandatory drug license from CDSCO. Requires filing Form 40 (Registration) and Form 10 (Import license) under Drugs & Cosmetics Rules.',
      steps: ['Verify manufacturer WHO-GMP certification.', 'File drug dossier in CDSCO SUGAM portal.', 'Obtain Form 10 clearance for retail trade import.'],
    },
    {
      id: 'g4',
      title: 'AZO Dye Safety Standards for Knitted Garments',
      type: 'Certifications',
      agency: 'Textiles Committee',
      hscode: '61091000',
      product: 'Cotton T-shirts & Apparel',
      description: 'Protective safety test. Garments containing hazardous aromatic amines or AZO colorants are prohibited. Strict inspection limits apply.',
      steps: ['Acquire test report from laboratory recognized by Textiles Committee.', 'Label details on fiber composition and origin clearly.', 'Customs verified randomly on arrival.'],
    },
    {
      id: 'g5',
      title: 'Minimum Export Price (MEP) & Non-GMO Standards',
      type: 'Export Schemes',
      agency: 'FSSAI / APEDA',
      hscode: '10063020',
      product: 'Basmati Rice',
      description: 'Grain quality control. Exporters must fulfill phytosanitary parameters, non-GMO status, and meet price thresholds set by Ministry of Commerce.',
      steps: ['Register exporter profile on APEDA portal.', 'Verify Minimum Export Price compliance.', 'Apply for Phytosanitary certificate prior to loading.'],
    },
    {
      id: 'g6',
      title: 'Rebate of State and Central Taxes & Levies (RoSCTL)',
      type: 'Export Schemes',
      agency: 'Ministry of Commerce',
      hscode: '61091000',
      product: 'Knitted Textiles & Garments',
      description: 'Financial refund scheme. Reimburses state/central duties, fees, and taxes embedded in textile production. Greatly enhances export value.',
      steps: ['Calculate eligible shipping bill value.', 'File rebate request on ICEGATE customs system.', 'Acquire trade credit scrips for duty payment exemptions.'],
    },
    {
      id: 'g7',
      title: 'India-UAE CEPA Preferential Duty Free Trade',
      type: 'Trade Agreements',
      agency: 'Customs Department',
      hscode: '61091000',
      product: 'Multi-sector (Apparel, Pharma, Telecom)',
      description: 'Exporters can secure lower or zero import tariffs on products shipped between India and the UAE under rules of origin clauses.',
      steps: ['Identify preferential rate margins.', 'Ensure local value addition content (usually >40%).', 'Obtain Certificate of Origin from authorized local export chambers.'],
    }
  ];

  const filteredGuidelines = guidelinesData.filter((g) => {
    const matchesFilter = filter === 'All' || g.type === filter;
    const matchesSearch =
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.hscode.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="search-results-section">
      <div className="detail-header" style={{ marginBottom: '10px' }}>
        <div className="detail-titles">
          <h1 className="hero-title" style={{ fontSize: '2.4rem', textAlign: 'left', marginBottom: '4px' }}>
            Trade Guidelines Library
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.05rem', textAlign: 'left', marginBottom: '30px' }}>
            Browse structured regulatory guidelines, import rules, export benefits, and certification requirements.
          </p>
        </div>
      </div>

      {/* Simplified Category Filters & Search Input */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '30px', justifyContent: 'space-between' }}>
        <div className="guidelines-filter-bar" style={{ margin: '0', padding: '0', border: 'none' }}>
          {['All', 'Import Policy', 'Export Schemes', 'Certifications', 'Trade Agreements'].map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ width: '100%', maxWidth: '300px' }}>
          <div className="input-with-addon">
            <input
              type="text"
              placeholder="Search guidelines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      {/* Guidelines Grid */}
      {filteredGuidelines.length === 0 ? (
        <div className="card text-center" style={{ padding: '60px 40px' }}>
          <p style={{ color: 'var(--text-muted)' }}>No guidelines found matching your filter and search criteria.</p>
        </div>
      ) : (
        <div className="guidelines-grid">
          {filteredGuidelines.map((g) => (
            <div key={g.id} className="card guideline-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ padding: '20px' }}>
                <div className="guideline-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="guideline-type-badge" style={{ background: 'var(--saffron)', color: '#fff', padding: '3px 8px', fontSize: '0.68rem', borderRadius: '3px', fontWeight: '700' }}>{g.type}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Agency: {g.agency}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: 'var(--navy-blue)' }}>
                  {g.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', marginBottom: '16px', lineHeight: '1.45' }}>
                  {g.description}
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '6px' }}>
                    Standard Actions:
                  </h4>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-body)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {g.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-light)' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Applies to {g.product}:</span>
                  <span
                    style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--navy-blue)', cursor: 'pointer', fontFamily: 'monospace' }}
                    onClick={() => onSearchCode(g.hscode)}
                  >
                    HS {g.hscode}
                  </span>
                </div>
                <button
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  onClick={() => onSearchCode(g.hscode)}
                >
                  View Tariff
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TradeGuidelines;
