const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fallback = require('express-history-api-fallback');
const csurf = require('csurf');
const helmet = require('helmet');
const csrf = require('./middlewares/csrf');
const api = require('./api/api');
const app = express();
const root = path.resolve(__dirname, '..', 'build');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(csurf({
//     cookie: {
//         httpOnly: true
//     }
// }));
app.use('/api', api);
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://www.googletagmanager.com'],
            imgSrc: ["'self'", 'https://www.googletagmanager.com'],
            frameAncestors: ["'self'", 'http://miotrapagina.com']
        }
    }),
    helmet.referrerPolicy({ policy: 'strict-origin' }),
    helmet({
        hidePoweredBy: { setTo: 'PHP 4.2.0' }
    }),
    // csrf,
    express.static(root),
    fallback('index.html', { root })
);
app.listen(3000, () => {
    console.log('server listening on http://localhost:3000');
});
