const express = require('express');
const adControllers = require('../Controllers/AdControllers');
const router = express.Router();

router.get('/get-all-ads', adControllers.getAllAds);
router.get('/get-ad-by-id/:id', adControllers.getAdById);

module.exports = router;