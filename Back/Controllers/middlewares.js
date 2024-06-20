const jwt = require('jsonwebtoken');
const sql = require('./../database');
const { ErrorHandling } = require('./../utils/errorHandeling');


const checkTokenValidity = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if(!token)  throw new ErrorHandling('unauthorized', 401);

        if(!token.startsWith('Bearer'))   throw new ErrorHandling('token must start with Bearer string', 403); 
        token = token.split(' ')[1];

        const decode = jwt.verify(token, process.env.SECRET_JWT);


        // jwt.verify verify 100% if the user exist or no, but we do the next part because when
        // a user have been deleted, jwt.verify don't know, so we must recheck
        const result = await sql.query`SELECT id, name FROM Admin WHERE id = ${decode.id}`;
        const decodedAdmin = result.recordset[0]; // search for the user in db
        if(!decodedAdmin)
            throw new ErrorHandling('the user belonging to this token does no longer exist', 404)


        req.admin = decodedAdmin;
        next();
    } catch(err) {
        // error already wrapped
        if(err.statusCode)  return next(err);

        return next(new ErrorHandling(err.message, 400));
    }
}


module.exports = { checkTokenValidity }