const mongoose = require('mongoose');

const HSCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please add an HS Code'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a product description'],
    trim: true,
  },
  category: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  importPolicy: {
    type: String,
    enum: ['Free', 'Restricted', 'Prohibited'],
    default: 'Free',
  },
  policyConditions: {
    type: String,
    default: 'Standard import regulations apply.',
  },
  tariffs: {
    bcd: {
      type: Number,
      required: true,
      default: 10.0, // Basic Customs Duty (%)
    },
    sws: {
      type: Number,
      required: true,
      default: 10.0, // Social Welfare Surcharge (% of BCD)
    },
    igst: {
      type: Number,
      required: true,
      default: 18.0, // Integrated GST (%)
    },
  },
  preferentialTariffs: [
    {
      agreement: {
        type: String,
        required: true,
      },
      partnerCountry: {
        type: String,
        required: true,
      },
      rate: {
        type: Number,
        required: true,
      },
    },
  ],
  exportIncentives: {
    rodtep: {
      type: Number, // Remission of Duties and Taxes on Exported Products (%)
      default: 0.0,
    },
    drawback: {
      type: Number, // Duty Drawback Rate (%)
      default: 0.0,
    },
    otherIncentive: {
      type: String,
      default: 'No additional export incentives available.',
    },
  },
  spsTbtMeasures: [
    {
      measureType: {
        type: String,
        enum: ['SPS', 'TBT'],
        required: true,
      },
      agency: {
        type: String,
        required: true,
      },
      requirement: {
        type: String,
        required: true,
      },
    },
  ],
  rulesOfOrigin: {
    type: String,
    default: 'Standard rules of origin apply. General content requirement is 40% local value addition.',
  },
  recentChange: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('HSCode', HSCodeSchema);
