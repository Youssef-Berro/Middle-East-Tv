const express = require('express');
const categoryControllers = require('./../Controllers/CategoryControllers');
const router = express.Router();

router.get('/get-latest-news-by-category', categoryControllers.getLatestNewsByCategory);
router.get('/get-all-category-names-and-specific-name', categoryControllers.getCategoryNamesAndSpecificNames)
router.get('/get-all-category-names', categoryControllers.getAllCategoryNames)
router.get('/get-all-category-specific-names', categoryControllers.getAllCategorySpecificNames)
router.get('/get-random-category', categoryControllers.getRandomCategory)

module.exports = router;