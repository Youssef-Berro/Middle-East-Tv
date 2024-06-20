const express = require('express');
const adminControllers = require('./../Controllers/AdminControllers');
const middlewares = require('./../Controllers/middlewares');
const router = express.Router();
const multer = require('multer');
const functions = require('./../utils/functions')

// router.post('/sign-up', adminControllers.signUp);
router.post('/log-in', adminControllers.logIn);


// from here to below every endpoint needs admin authentication
router.use(middlewares.checkTokenValidity);


router.delete('/news/:id', adminControllers.deleteNews);
router.delete('/ad/:id', adminControllers.deleteAd);
router.delete('/program/:id', adminControllers.deleteProgram)



router.get('/news-search', adminControllers.newsSearch);
router.get('/ads-search', adminControllers.adsSearch);
router.get('/programs-search', adminControllers.programsSearch);

router.patch('/change-password', adminControllers.changePassword);



// create news image multer
let storage = functions.createMulterStorage('./../Front(Admin)/img/news', './../Front(Client)/img/news');
let upload = multer({storage});
router.post('/news', upload.single('image'), adminControllers.createNews);
router.patch('/news/:id', upload.single('image'), adminControllers.updateNews);


// create ad image multer
storage = functions.createMulterStorage('./../Front(Admin)/img/ads', './../Front(Client)/img/ads');
upload = multer({storage});
router.post('/ad', upload.single('image'), adminControllers.createAd);
router.patch('/ad/:id', upload.single('image'), adminControllers.updateAd)


// create program image multer
storage = functions.createMulterStorage('./../Front(Admin)/img/programs', './../Front(Client)/img/programs');
upload = multer({storage});
router.post('/program', upload.single('image'), adminControllers.createProgram);
router.patch('/program/:id', upload.single('image'), adminControllers.updateProgram);

module.exports = router;