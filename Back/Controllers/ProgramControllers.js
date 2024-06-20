const sql = require('./../database');
const { ErrorHandling } = require('../utils/errorHandeling');


// get by important day time
// work as follow : /api/program/get-important-programs?time=10&time=14&time=20 (24 clock base)
const getImportantPrograms = async (req, res, next) => {
    try {
        const times = req.query.time; // return an array of times;
        if(!Array.isArray(times))   throw new ErrorHandling('missing time query param', 400);
        if(times.length <= 0)   throw new ErrorHandling('at least must pass 1 time', 400);
        if(times.length > 6)    throw new ErrorHandling('maximum 6 time as query param', 400);


        const programs = times.map( async time => {
            const result = await sql.query`SELECT * FROM Program WHERE time = ${time}`;
            return result.recordset;
        })

        res.status(200).json({
            status: 'success',
            data: programs
        })
    }catch(err) {
        // error already wrapped
        if(err.statusCode)  return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}


const getAllPrograms = async (req, res, next) => {
    try {
        const result = await sql.query`SELECT * FROM Program`;
        const programs = result.recordset;

        res.status(200).json({
            status: 'success',
            data: programs
        })
    }catch(err) {
        next(new ErrorHandling(err.message, 400));
    }
}


const fetchSingleProgram = async (req, res, next) => {
    try {
        const result = await sql.query`EXEC navigateProgram`;

        // Check if the result set is empty
        if(!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({
                status: 'success',
                message: 'No more programs available.'
            });
        }

        const program = result.recordset[0];

        res.status(200).json({
            status: 'success',
            data: program
        });
    }catch(err) {
        // error already wrapped
        if(err.statusCode)  return next(err);

        next(new ErrorHandling(err.message, 400));
    }
}


// get single program by id
const getProgramById = async (req, res, next) => {
    try {
        const {id} = req.params;

        const result = await sql.query`SELECT * FROM getProgramById(${id})`;
        const program = result.recordset[0];
        if(!program)   throw new ErrorHandling(`program with id: ${id} not found`, 404);

        res.status(200).json({
            status: 'success',
            data: program
        })
    }catch(err) {
        next(new ErrorHandling(err.message, 404));
    }
}



module.exports = {
    getImportantPrograms,
    getAllPrograms,
    fetchSingleProgram,
    getProgramById
}