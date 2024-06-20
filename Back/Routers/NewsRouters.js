const express = require('express');
const newsControllers = require('./../Controllers/NewsControllers');
const router = express.Router();

router.get('/get-latest-news', newsControllers.getLatestNews);
router.get('/get-news-by-id/:id', newsControllers.getNewsById);
router.get('/news-search', newsControllers.newsSearch)


module.exports = router;