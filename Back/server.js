const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    process.exit(1);
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("listening...");
})


process.on('unhandledRejection' , err => {
    console.log(err.name, err.message);
    process.exit(1) // passing 1 => error, 0 => no error
})