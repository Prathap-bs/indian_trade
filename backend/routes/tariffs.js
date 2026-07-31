const express = require('express');
const router = express.Router();
const HSCode = require('../models/HSCode');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Search HS Codes and products
// @route   GET /api/tariffs/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      // Return a standard list of standard codes if no query is provided
      const hscodes = await HSCode.find({}).limit(10);
      return res.json(hscodes);
    }

    // Build regex search matching code or description or category or industry
    const searchRegex = new RegExp(query, 'i');
    const results = await HSCode.find({
      $or: [
        { code: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { industry: searchRegex }
      ]
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get detailed info of a single HS Code
// @route   GET /api/tariffs/:code
// @access  Public
router.get('/detail/:code', async (req, res) => {
  try {
    const code = req.params.code;
    const hscode = await HSCode.findOne({ code });

    if (!hscode) {
      return res.status(404).json({ message: `HS Code ${code} not found.` });
    }

    res.json(hscode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user's watchlist products
// @route   GET /api/tariffs/watchlist
// @access  Private
router.get('/watchlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Find all HSCode entries that match codes in the user's watchlist
    const watchlistData = await HSCode.find({ code: { $in: user.watchlist } });
    
    res.json(watchlistData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a product to watchlist
// @route   POST /api/tariffs/watchlist
// @access  Private
router.post('/watchlist', protect, async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Product HS Code is required' });
    }

    // Verify HS Code exists in our DB
    const codeExists = await HSCode.findOne({ code });
    if (!codeExists) {
      return res.status(404).json({ message: 'Invalid HS Code' });
    }

    const user = await User.findById(req.user.id);

    if (user.watchlist.includes(code)) {
      return res.status(400).json({ message: 'Product already in watchlist' });
    }

    user.watchlist.push(code);
    await user.save();

    res.status(200).json({ watchlist: user.watchlist, message: 'Added to watchlist successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Remove a product from watchlist
// @route   DELETE /api/tariffs/watchlist/:code
// @access  Private
router.delete('/watchlist/:code', protect, async (req, res) => {
  try {
    const code = req.params.code;
    const user = await User.findById(req.user.id);

    if (!user.watchlist.includes(code)) {
      return res.status(404).json({ message: 'Product not found in watchlist' });
    }

    user.watchlist = user.watchlist.filter((item) => item !== code);
    await user.save();

    res.status(200).json({ watchlist: user.watchlist, message: 'Removed from watchlist successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
