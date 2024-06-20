const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const limiter = require('./utils/functions');
const xss = require('xss-clean');
const adminRouters = require('./Routers/AdminRouter');
const categoryRouters = require('./Routers/CategoryRouters');
const newsRouters = require('./Routers/NewsRouters');
const programRouters = require('./Routers/ProgramRouters');
const adRouters = require('./Routers/AdRouters');
const {ErrorHandling, errorHandlingMiddleware} = require('./utils/errorHandeling');
const app = express();


app.use(helmet()); // set security for HTTP headers
app.use(cors());
app.use(express.json({limit : '10kb'}));
app.use(xss()); // data sanitization against html malicious data (xss)


// Routers
app.use('/api/admin', adminRouters);
app.use('/api/news', newsRouters);
app.use('/api/category', categoryRouters);
app.use('/api/program', programRouters);
app.use('/api/ad', adRouters);


// uncatched url's
app.all('*', (req, res, next) => {
    next(new ErrorHandling(`can't find ${req.originalUrl} in our server!`, 404))
})


app.use(errorHandlingMiddleware);
module.exports = app;