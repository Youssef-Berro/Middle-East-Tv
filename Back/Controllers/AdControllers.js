const sql = require('../database');
const { ErrorHandling } = require('../utils/errorHandeling');


// get all ads sorter by price asc
const getAllAds = async (req, res, next) => {
    try {
        const result = await sql.query`EXEC getallAds`;
        const ads = result.recordset;

        res.status(200).json({
            status: 'success',
            data: ads
        })
    }catch(err) {
        next(new ErrorHandling(err.message, 400));
    }
}

// get single ad by id
const getAdById = async (req, res, next) => {
    try {
        const {id} = req.params;

        const result = await sql.query`SELECT * FROM getAdById(${id})`;
        const ad = result.recordset[0];
        if(!ad)   throw new ErrorHandling(`ad with id: ${id} not found`, 404);

        res.status(200).json({
            status: 'success',
            data: ad
        })
    }catch(err) {
        next(new ErrorHandling(err.message, 404));
    }
}

module.exports = {
    getAllAds,
    getAdById
}