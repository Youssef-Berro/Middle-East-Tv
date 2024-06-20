const express = require('express');
const sql = require('./../database');
const programControllers = require('./../Controllers/ProgramControllers');
const { ErrorHandling } = require('../utils/errorHandeling');
const router = express.Router();

router.get('/get-important-programs', programControllers.getImportantPrograms);
router.get('/get-all-programs', programControllers.getAllPrograms);
router.get('/fetch-single-program', programControllers.fetchSingleProgram);
router.get('/get-program-by-id/:id', programControllers.getProgramById);


// router.get('/test', async (req, res, next) => {
//     try{
//         await sql.query`UPDATE News SET createdAt='2024-1-9' WHERE createdAt = '2023-12-19'`

//         res.status(200).json({
//             status: 'done'
//         })
//     }catch(err) {
//         next(new ErrorHandling(err.message, 400));
//     }
// })

module.exports = router;