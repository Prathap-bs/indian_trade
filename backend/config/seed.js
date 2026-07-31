const HSCode = require('../models/HSCode');

const seedData = [
  {
    code: '84713010',
    description: 'Personal computers, laptops, notebooks, and microcomputers weighing less than 10 kg',
    category: 'Electronics',
    industry: 'Information Technology',
    importPolicy: 'Restricted',
    policyConditions: 'Import subject to authorization by DGFT (Directorate General of Foreign Trade). Exempt for passenger baggage, re-import, or single units for research.',
    tariffs: {
      bcd: 0.0, // IT Agreement allows 0%
      sws: 0.0,
      igst: 18.0,
    },
    preferentialTariffs: [], // 0% MFN doesn't need FTA
    exportIncentives: {
      rodtep: 2.0,
      drawback: 1.5,
      otherIncentive: 'Eligible for Production Linked Incentive (PLI) Scheme for IT Hardware.',
    },
    spsTbtMeasures: [
      {
        measureType: 'TBT',
        agency: 'BIS (Bureau of Indian Standards)',
        requirement: 'Compulsory Registration Order (CRO) for electronic goods. Safe testing under IS 13252 part 1.',
      },
      {
        measureType: 'TBT',
        agency: 'MeitY',
        requirement: 'Compliance certificate showing registration of unique model numbers on the online portal.',
      },
    ],
    rulesOfOrigin: 'Product-specific rules requiring change in tariff subheading (CTSH) and local value content of at least 35% under general FTAs.',
    recentChange: 'Import policy modified from Free to Restricted to support domestic production (Make in India) and enhance cybersecurity checkups.',
  },
  {
    code: '85171300',
    description: 'Smartphones for cellular networks or for other wireless networks',
    category: 'Electronics',
    industry: 'Telecommunications',
    importPolicy: 'Free',
    policyConditions: 'Subject to registration of IMEI numbers with Indian Customs (ICEGATE) portal prior to import clearance.',
    tariffs: {
      bcd: 20.0,
      sws: 10.0,
      igst: 18.0,
    },
    preferentialTariffs: [
      {
        agreement: 'India-Japan CEPA',
        partnerCountry: 'Japan',
        rate: 12.5,
      },
      {
        agreement: 'India-Korea CEPA',
        partnerCountry: 'South Korea',
        rate: 14.0,
      },
      {
        agreement: 'India-UAE CEPA',
        partnerCountry: 'United Arab Emirates',
        rate: 10.0,
      },
    ],
    exportIncentives: {
      rodtep: 1.5,
      drawback: 2.2,
      otherIncentive: 'PLI Scheme for Mobile Manufacturing offers 4-6% incremental sales incentives on exports.',
    },
    spsTbtMeasures: [
      {
        measureType: 'TBT',
        agency: 'WPC (Wireless Planning & Coordination)',
        requirement: 'Equipment Type Approval (ETA) for wireless RF transmitters operating in licensed/unlicensed bands.',
      },
      {
        measureType: 'TBT',
        agency: 'BIS',
        requirement: 'Safety compliance registration under IS 13252 (Part 1) and battery safety standard IS 16046.',
      },
    ],
    rulesOfOrigin: 'Double transformation or change in HS code at 4-digit level (CTH) + 40% local value addition in the exporting country.',
    recentChange: 'Basic Customs Duty (BCD) maintained at 20% to encourage domestic mobile assembly and component fabrication.',
  },
  {
    code: '30049099',
    description: 'Medicaments consisting of mixed or unmixed products for therapeutic or prophylactic uses, in retail packaging: Other generic tablets and formulations',
    category: 'Pharmaceuticals',
    industry: 'Healthcare',
    importPolicy: 'Free',
    policyConditions: 'Subject to registration and import licensing issued by the Central Drugs Standard Control Organisation (CDSCO).',
    tariffs: {
      bcd: 10.0,
      sws: 10.0,
      igst: 12.0,
    },
    preferentialTariffs: [
      {
        agreement: 'India-ASEAN FTA',
        partnerCountry: 'Singapore',
        rate: 4.0,
      },
      {
        agreement: 'India-Japan CEPA',
        partnerCountry: 'Japan',
        rate: 2.5,
      },
      {
        agreement: 'India-UAE CEPA',
        partnerCountry: 'United Arab Emirates',
        rate: 0.0,
      },
    ],
    exportIncentives: {
      rodtep: 1.0,
      drawback: 1.8,
      otherIncentive: 'Exemption from import duty on active pharmaceutical ingredients (APIs) under the Advance Authorisation Scheme.',
    },
    spsTbtMeasures: [
      {
        measureType: 'SPS',
        agency: 'CDSCO',
        requirement: 'Import registration (Form 40) and import license (Form 10) under the Drugs & Cosmetics Rules.',
      },
      {
        measureType: 'SPS',
        agency: 'Ministry of Health',
        requirement: 'Certificate of Pharmaceutical Product (CoPP) and WHO-GMP guidelines validation.',
      },
    ],
    rulesOfOrigin: 'Manufactured from non-originating materials using chemical reaction, purification, or change in classification (CTH) + 35% local value.',
    recentChange: 'GST rate on generic paracetamol and life-saving formulations stabilized at 12% to lower healthcare costs.',
  },
  {
    code: '61091000',
    description: 'T-shirts, singlets and other vests, knitted or crocheted, of cotton',
    category: 'Textiles',
    industry: 'Apparel & Fashion',
    importPolicy: 'Free',
    policyConditions: 'Must comply with AZO dye safety regulations. Certificate from national textiles lab required.',
    tariffs: {
      bcd: 25.0,
      sws: 10.0,
      igst: 5.0,
    },
    preferentialTariffs: [
      {
        agreement: 'India-Australia ECTA',
        partnerCountry: 'Australia',
        rate: 10.0,
      },
      {
        agreement: 'India-UAE CEPA',
        partnerCountry: 'United Arab Emirates',
        rate: 0.0,
      },
    ],
    exportIncentives: {
      rodtep: 4.3,
      drawback: 2.1,
      otherIncentive: 'Rebate of State and Central Taxes and Levies (RoSCTL) scheme benefits up to 6.05% on export values.',
    },
    spsTbtMeasures: [
      {
        measureType: 'TBT',
        agency: 'Textiles Committee',
        requirement: 'Pre-shipment certificate declaring freedom from forbidden amines and AZO colorants.',
      },
    ],
    rulesOfOrigin: 'Yarn-forward rule. Fibers must be spun, knitted, and cut/sewn entirely in the country claiming origin.',
    recentChange: 'RoSCTL scheme extended until March 2026 to support global export competitiveness of Indian garments.',
  },
  {
    code: '10063020',
    description: 'Semi-milled or wholly milled rice, whether or not polished or glazed: Basmati rice',
    category: 'Agriculture',
    industry: 'Food Processing',
    importPolicy: 'Free',
    policyConditions: 'Import subject to phytosanitary permit. Export subject to Minimum Export Price (MEP) restrictions.',
    tariffs: {
      bcd: 70.0,
      sws: 10.0,
      igst: 5.0,
    },
    preferentialTariffs: [], // Excluded from preferential agreements to protect local farmers
    exportIncentives: {
      rodtep: 0.0,
      drawback: 0.0,
      otherIncentive: 'Eligible for APEDA (Agricultural and Processed Food Products Export Development Authority) export subsidies.',
    },
    spsTbtMeasures: [
      {
        measureType: 'SPS',
        agency: 'FSSAI (Food Safety Standards Authority of India)',
        requirement: 'Non-GMO declaration, maximum pesticide residue limits clearance, and phytosanitary certificate.',
      },
      {
        measureType: 'SPS',
        agency: 'NPPO',
        requirement: 'Phytosanitary inspection and fumigation using Methyl Bromide with treatment logs.',
      },
    ],
    rulesOfOrigin: 'Must be wholly obtained (grown, harvested, and milled) within India.',
    recentChange: 'Minimum Export Price (MEP) rules adjusted dynamically by the Ministry of Commerce to stabilize domestic food security.',
  },
  {
    code: '09012190',
    description: 'Coffee, roasted, decaffeinated or not, other than ground roasted beans',
    category: 'Agriculture',
    industry: 'Food & Beverage',
    importPolicy: 'Free',
    policyConditions: 'Import subject to FSSAI packaging and labeling regulations for shelf life, manufacturing batch numbers, and origin.',
    tariffs: {
      bcd: 100.0,
      sws: 10.0,
      igst: 18.0,
    },
    preferentialTariffs: [
      {
        agreement: 'India-ASEAN FTA',
        partnerCountry: 'Vietnam',
        rate: 80.0,
      },
    ],
    exportIncentives: {
      rodtep: 1.4,
      drawback: 1.0,
      otherIncentive: 'Coffee Board of India provides transport and branding assistance subsidies for global export markets.',
    },
    spsTbtMeasures: [
      {
        measureType: 'SPS',
        agency: 'FSSAI',
        requirement: 'Food import clearance, labeling in English detailing manufacturer address, ingredient list, and shelf life.',
      },
    ],
    rulesOfOrigin: 'Wholly obtained coffee beans or change in subheading (CTSH) plus 35% local value addition in processing.',
    recentChange: 'Basic customs duty maintained at 100% to safeguard local planters in Karnataka, Kerala, and Tamil Nadu from cheap imports.',
  }
];

const seedDB = async () => {
  try {
    const count = await HSCode.countDocuments();
    if (count === 0) {
      await HSCode.deleteMany(); // Safety clear
      await HSCode.insertMany(seedData);
      console.log('Database successfully seeded with standard HS Codes and Trade data.');
    } else {
      console.log('Database already contains records. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDB;
