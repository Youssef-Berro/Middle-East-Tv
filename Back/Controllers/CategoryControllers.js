const sql = require('./../database');
const { ErrorHandling } = require('../utils/errorHandeling');


// get latest news by category the number of news passed as query
const getLatestNewsByCategory = async (req, res, next) => {
    try {
        const {nbOfNews, categoryName} = req.query;
        if (!nbOfNews || !categoryName)
            throw new ErrorHandling('This endpoint must have nbOfNews and categoryName queries', 400);

        const result = await sql.query`SELECT * FROM getLatestNewsByCategory(${nbOfNews}, ${categoryName})`;
        const news = result.recordset;

        if(news.length == 0)   throw new ErrorHandling(`news with category ${categoryName} not found`, 404);


        res.status(200).json({
            status: 'success',
            data: news
        })
    } catch(err) {
        if(err.statusCode)  return next(err); // already wrapped

        next(new ErrorHandling(err.message, 400));
    }
}


const getCategoryNamesAndSpecificNames = async (req, res, next) => {
    try {
        const result = await sql.query`EXEC getCategoryNamesAndSpecificNames`;
        const categoryNames = result.recordset.map(row => row.categoryName);


        res.status(200).json({
            status: 'success',
            data: categoryNames
        })
    } catch(err) {
        if(err.statusCode)  return next(err); // already wrapped

        next(new ErrorHandling(err.message, 400));
    }
}

const getAllCategoryNames = async (req, res, next) => {
    try {
        const result = await sql.query`SELECT DISTINCT name FROM Category`
        const categoryNames = result.recordset.map(row => row.name);


        res.status(200).json({
            status: 'success',
            data: categoryNames
        })
    }catch(err) {
        next(new ErrorHandling(err.message, 400));
    }
}

const getAllCategorySpecificNames = async (req, res, next) => {
    try {
        const result = await sql.query`SELECT DISTINCT SpecificName FROM Category`
        const categoryNames = result.recordset.map(row => row.SpecificName);


        res.status(200).json({
            status: 'success',
            data: categoryNames
        })
    }catch(err) {
        next(new ErrorHandling(err.message, 400));
    }
}

const getRandomCategory = async (req, res, next) => {
    try {
        let news = [];
        const {nbOfNews} = req.query;
        if(!nbOfNews)   throw new ErrorHandling('req must contain nbOfNews query', 400);
        if(nbOfNews < 1)    throw new ErrorHandling('nbOfNews cannot be negative or 0', 400);  

        if(nbOfNews <= 3) {
            const resp = await sql.query`SELECT * FROM getRandomNewsByCategory(${nbOfNews})`;
            news = resp.recordset;
        }else {
            for(let i = 0; i < 4; i++) {
                const resp = await sql.query`SELECT * FROM getRecommendedNewsByCategory(${nbOfNews})`;
                const data = resp.recordset;

                if(i == 0)  {
                    news.push([...data]);
                    continue;
                }

                if((i != 0) && (data.length != 0)) {
                    let bools = news.filter( category => {
                        if((category.length != 0) && (category[0].categoryName != data[0].categoryName))
                            return true;

                        return false;
                    })

                    if(!bools.includes(false))  news.push([...data]);
                    else  i--;
                }
                
            }
        }

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
    getLatestNewsByCategory,
    getCategoryNamesAndSpecificNames,
    getAllCategoryNames,
    getAllCategorySpecificNames,
    getRandomCategory
}