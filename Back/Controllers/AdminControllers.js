const sql = require('./../database');
const { ErrorHandling } = require('../utils/errorHandeling');
const { generateToken, checkCorrectPassword, hashPassword } = require('./../utils/functions');


// const signUp = async (req, res, next) => {
//     try {
//         const {name, password} = req.body;
//         if(!name || !password)
//             throw new ErrorHandling('missing data', 401);

//         hashedPass = await hashPassword(password);

//         await sql.query`INSERT INTO Admin (name, password) VALUES (${name}, ${hashedPass})`

//         res.status(201).json({ status: 'success' })
//     } catch(err) {
//         // error code = 11000 if the error throwed by a unique validator
//         if(err.code == 11000) {
//             const key = `${Object.keys(err.keyValue)[0]}`;
//             return next(new handleDuplicateFieldsDB(400, key, err.keyValue[key]));
//         }
//         else if(err.statusCode)   return next(err); // error already wrapped

//         next(new ErrorHandling(err.message, 400));
//     }
// }

const logIn = async (req, res, next) => {
    try {
        const {name, password} = req.body;
        if(!name || !password) throw new ErrorHandling('missing name or password', 401);


        let admin = {};

        // Call the stored procedure
        const result = await sql.request()
                .input('inputName', name)
                .output('id')
                .output('adminName')
                .output('adminPassword')
                .execute('getAdminDetailsByName');

        admin.id = result.output.id;
        admin.name = result.output.adminName;
        admin.password = result.output.adminPassword;


        if(!admin)   throw new ErrorHandling(`incorrect name or password`, 401);

        const isPasswordCorrect = await checkCorrectPassword(password, admin.password);
        if(!isPasswordCorrect)   throw new ErrorHandling(`incorrect name or password`, 401);

        const token = generateToken({id: admin.id});

        delete admin.password;
        res.status(200).json({
            status: 'success',
            token,
            data: admin
        })
    } catch(err) {
        // error already wrapped
        if (err.statusCode)   return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}


const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, passwordConfirm } = req.body;
        if((!oldPassword) || (!newPassword) || (!passwordConfirm))
            throw new ErrorHandling('missing old password, new password or password confirm', 401);

        if(newPassword != passwordConfirm)
            throw new ErrorHandling('new password and password confirm must be the same', 401);


        const result = await sql.query`SELECT * FROM Admin WHERE id = ${req.admin.id}`
        const admin = result.recordset[0];
        if(!admin)   throw new ErrorHandling('invalid admin', 401);


        const isPasswordCorrect = await checkCorrectPassword(oldPassword, admin.password);
        if(!isPasswordCorrect)   throw new ErrorHandling(`incorrect password`, 401);


        const hashedPass = await hashPassword(newPassword);

        await sql.query`UPDATE Admin SET password = ${hashedPass} WHERE id = ${req.admin.id}`;


        const token = generateToken({id : admin.id});
        res.status(200).json({
            status: 'success',
            token
        })
    } catch (err) {
        // error already wrapped
        if(err.statusCode)   return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}


const createNews = async (req, res, next) => {
    try {
        const {title, content, categoryName, categorySpecificName} = req.body;
        if(!title || !content || !categoryName || !categorySpecificName)
            throw new ErrorHandling(
                'request body must contain: title, image, content, categoryName and categorySpecificName', 
                400);

        if(!req.file)
                throw new ErrorHandling('image file error', 400);

        const image = req.file.filename;


        await sql.query`EXEC createNews 
                                @title = ${title}, 
                                @image = ${image}, 
                                @content = ${content},
                                @createdAt = ${new Date()}, 
                                @authorId = ${req.admin.id},
                                @categoryName = ${categoryName}, 
                                @specificName = ${categorySpecificName}`;

        res.status(201).json({
            status: 'success',
            data: null
        })
    }catch(err) {
        if(err.statusCode)  return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}


const updateNews = async (req, res, next) => {
    try {
        const {id} = req.params;
        if(req.body.createdAt || req.body.AuthorID)
            throw new ErrorHandling('cannot update createdAt or AuthorID news attributes', 400);

        let image ;
        let responseData = null;
        const {title, content, categoryName, categorySpecificName} = req.body;
        if(req.file)    image = req.file.filename;


        let queryStr = '';
        if(title)   queryStr += `title = '${title}'`;
        if(image) {
            if(queryStr.length != 0)    queryStr += ', ';
            queryStr += `image = '${image}'`;
        }
        if(content) {
            if(queryStr.length != 0)    queryStr += ', ';
            queryStr += `content = '${content}'`;
        }


        let result = await sql.query`SELECT * FROM getNewsById(${id})`;
        const news = result.recordset[0];
        if(!news)   throw new ErrorHandling(`news with id: ${id} not found`, 404);

        // update the news
        if(queryStr.length !== 0) {
            const query = `UPDATE News SET ${queryStr} WHERE id = ${id};`;
            await sql.query(query);
        }


        if(categoryName && !categorySpecificName) {
            result = await sql.query`SELECT Top 1 * from Category 
                                WHERE name = ${categoryName}`;

            const category = result.recordset[0];

            if(!category)
                throw new ErrorHandling(`category ${categoryName} not found`, 400);

            await sql.query`UPDATE NewsCategoryRelation 
                            SET categoryID = ${category.id}
                            WHERE newsId = ${id};`;


            responseData = {categoryName: category.name, 
                            categorySpecificName: category.SpecificName}
        }

        if(categoryName && categorySpecificName) {
            result = await sql.query`SELECT * from Category 
                                WHERE Name = ${categoryName} and
                                SpecificName = ${categorySpecificName}`;

            const category = result.recordset[0];

            if(!category)
                throw new ErrorHandling(`category ${categoryName} with specific name ${categorySpecificName} not found`, 400);

            await sql.query`UPDATE NewsCategoryRelation 
                            SET categoryID = ${category.id}
                            WHERE newsId = ${id};`;


            responseData = {categoryName: category.name,
                            categorySpecificName: category.SpecificName}
        }

        res.status(201).json({
            status: 'success',
            data: responseData
        })
    }catch(err) {
        if(err.statusCode)  return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}


const deleteNews = async (req, res, next) => {
    try {
        const {id} = req.params;

        await sql.query`EXEC DeleteNewsAndRelation
                                    @newsId = ${id}`;
        res.status(204).json({
            status : 'success',
            data: null
        })
    }catch(err) {
        if(err.statusCode)  return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}


const createProgram = async (req, res, next) => {
    try {
        const {name, schedule, time} = req.body;
        if(!name || !schedule || !time)
            throw new ErrorHandling('request body must contain: name, image, time and schedule', 400);

        if(!req.file)   throw new ErrorHandling('image file error', 400);
        const image = req.file.filename;


        await sql.query`INSERT INTO Program (name, schedule, time, image, AuthorId) 
            VALUES (${name}, ${schedule}, ${time}, ${image}, ${req.admin.id})`

        res.status(201).json({
            status: 'success',
            data: null
        })
    }catch(err) {
        if(err.statusCode)  return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}


const updateProgram = async (req, res, next) => {
    try {
        const {id} = req.params;
        if(req.body.AuthorID)
            throw new ErrorHandling('cannot update AuthorID program attribute', 400);

        const {name, schedule, time} = req.body;
        let image;
        if(req.file)    image = req.file.filename;


        let queryStr = '';
        if(name)   queryStr += `name = '${name}'`;
        if(schedule) {
            if(queryStr.length != 0)    queryStr += ', ';
            queryStr += `schedule = '${schedule}'`;
        }
        if(time) {
            if(queryStr.length != 0)    queryStr += ', ';
            queryStr += `time = '${time}'`;
        }
        if(image) {
            if(queryStr.length != 0)    queryStr += ', ';
            queryStr += `image = '${image}'`;
        }

        const query = `UPDATE Program SET ${queryStr} WHERE id = ${id};`;
        await sql.query(query);


        res.status(201).json({
            status: 'success',
            data: null
        })
    }catch(err) {
        if(err.statusCode)  return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}


const deleteProgram = async (req, res, next) => {
    try {
        const {id} = req.params;

        await sql.query`DELETE FROM Program WHERE id = ${id}`;

        res.status(204).json({
            status : 'success',
            data: null
        })
    }catch(err) {
        if(err.statusCode)  return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}


const createAd = async (req, res, next) => {
    try {
        const {url, price, expiry, title} = req.body;
        if(!url || !price || !expiry || !title)
            throw new ErrorHandling('request body must contain: url, image, price, title and expiry', 400);

        const expiryDate = new Date(expiry)
        if(!(expiryDate instanceof Date))
            throw new ErrorHandling('expiry must be of type Date', 400);

        if(!req.file)   throw new ErrorHandling('image file error', 400);
        const image = req.file.filename;


        await sql.query`INSERT INTO Ad (url, image, price, expiry, AuthorId) 
            VALUES (${url}, ${image}, ${price}, ${expiryDate}, ${req.admin.id})`

        res.status(201).json({
            status: 'success',
            data: null
        })
    }catch(err) {
        if(err.statusCode)  return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}


const updateAd = async (req, res, next) => {
    try {
        const {id} = req.params;
        if(req.body.AuthorID)
            throw new ErrorHandling('cannot update AuthorID ad attribute', 400);

        const {price, expiry, url, title} = req.body;
        let image;
        if(req.file)    image = req.file.filename;


        let queryStr = '';
        if(price)   queryStr += `price = '${price}'`;
        if(expiry) {
            if(queryStr.length != 0)    queryStr += ', ';
            queryStr += `expiry = '${expiry}'`;
        }
        if(url) {
            if(queryStr.length != 0)    queryStr += ', ';
            queryStr += `url = '${url}'`;
        }
        if(image) {
            if(queryStr.length != 0)    queryStr += ', ';
            queryStr += `image = '${image}'`;
        }
        if(title) {
            if(queryStr.length != 0)    queryStr += ', ';
            queryStr += `title = '${title}'`;
        }


        const query = `UPDATE Ad SET ${queryStr} WHERE id = ${id};`;
        await sql.query(query);



        res.status(201).json({
            status: 'success',
            data: null
        })
    }catch(err) {
        if(err.statusCode)  return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}


const deleteAd = async (req, res, next) => {
    try {
        const {id} = req.params;

        await sql.query`DELETE FROM Ad WHERE id = ${id}`;

        res.status(204).json({
            status : 'success',
            data: null
        })
    }catch(err) {
        if(err.statusCode)  return next(err);

        next(new ErrorHandling(err.message, 400));
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

const adsSearch = async (req, res, next) => {
    try {
        const {nbOfAds, searchStr} = req.query;
        if(!nbOfAds || ! searchStr)
            throw new ErrorHandling('request must contain nbOfAds and searchStr query', 400);

        const result = await sql.query`SELECT * FROM adsSearch(${searchStr}, ${nbOfAds})`;
        const ads = result.recordset;


        res.status(200).json({
            status: 'success',
            data: ads
        })
    }catch(err) {
        if(err.statusCode)  return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}

const programsSearch = async (req, res, next) => {
    try {
        const {nbOfPrograms, searchStr} = req.query;
        if(!nbOfPrograms || ! searchStr)
            throw new ErrorHandling('request must contain nbOfPrograms and searchStr query', 400);

        const result = await sql.query`SELECT * FROM programsSearch(${searchStr}, ${nbOfPrograms})`;
        const programs = result.recordset;

        res.status(200).json({
            status: 'success',
            data: programs
        })
    }catch(err) {
        if(err.statusCode)  return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}


module.exports = {
    logIn, changePassword,
    createNews, updateNews, deleteNews,
    createProgram, updateProgram, deleteProgram,
    createAd, updateAd, deleteAd,
    newsSearch, adsSearch, programsSearch
    // ,signUp
}