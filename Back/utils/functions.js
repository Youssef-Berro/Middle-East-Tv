const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer')

const limiter = rateLimit({
    max: 1000, // when the server re-run the limit will reset for all IP's
    windowMs: 60 * 60 * 1000, // maximum 1000 request in 1 hr
    message :'too many request in short time, try again later'
})


const generateToken = (payload) => {
    return jwt.sign(payload, process.env.SECRET_JWT, {expiresIn: `${process.env.JWT_EXPIRY}`});
}


const checkCorrectPassword = async (password, userPassword) => {
    return await bcrypt.compare(password, userPassword);
}


const hashPassword = async (password) => {
    const hashedPass =  await bcrypt.hash(password, 12); // salt = 12
    return hashedPass;
}

const createMulterStorage = (...paths) => {
    return (multer.diskStorage({
        destination: (req, file, cb) => {
            paths.forEach( path => {
                cb(null, path);
            })
        },
        filename: (req, file, cb) => {
                return cb(null, file.originalname);
        }
    }))
}


module.exports = {
    limiter,
    generateToken,
    checkCorrectPassword,
    hashPassword,
    createMulterStorage
}