const { ErrorHandling } = require('../utils/errorHandeling');
const sql = require('./../database');


// get latest 20 news
const getLatestNews = async (req, res, next) => {
    try {
        const {nbOfNews} = req.query;
        if(!nbOfNews)   throw new ErrorHandling('request must contain nbOfNews query', 400);
        
        const oldPageSize = req.query.oldPageSize || 5;
        const currentPage = req.query.currentPage || 1;
        const offset = (currentPage - 1) * oldPageSize;


        const result = await sql.query`SELECT * FROM getLatestNews(${nbOfNews}, ${offset})`;
        const news = result.recordset;

        res.status(200).json({
            status: 'success',
            data: news
        })
    }catch(err) {
        if(err.statusCode)  return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}


// get single news by id
const getNewsById = async (req, res, next) => {
    try {
        const {id} = req.params;

        const result = await sql.query`SELECT * FROM getNewsById(${id})`;
        const news = result.recordset[0];
        if(!news)   throw new ErrorHandling(`news with id: ${id} not found`, 404);

        res.status(200).json({
            status: 'success',
            data: news
        })
    }catch(err) {
        next(new ErrorHandling(err.message, 404));
    }
}


const newsSearch = async (req, res, next) => {
    try {
        const {nbOfNews, searchStr} = req.query;
        if(!nbOfNews || ! searchStr)
            throw new ErrorHandling('request must contain nbOfNews and searchStr query', 400);

        const result = await sql.query`SELECT * FROM newsSearch(${searchStr}, ${nbOfNews})`;
        const news = result.recordset;

        res.status(200).json({
            status: 'success',
            data: news
        })
    }catch(err) {
        if(err.statusCode)  return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}


module.exports = {
    getLatestNews,
    getNewsById,
    newsSearch
}