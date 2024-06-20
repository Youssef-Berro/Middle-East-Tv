const sql = require('mssql');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const config = { // when it's work make the config attrb's as environement variables
    user: process.env.DB_USER_NAME,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

const pool = new sql.ConnectionPool(config);
pool.connect().then(() => { console.log("connection succesfull✅") })
            // .catch (err => {
            //     console.log(err);
            // }) 


module.exports = pool;