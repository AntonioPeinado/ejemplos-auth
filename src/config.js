const path = require('path');
const THREE_MINUTES = 3 * 60;
const THIRTY_DAYS = 30 * 24 * 60 * 60;

module.exports = {
    protocol: process.env.PROTOCOL || 'http',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3005,
    staticPath:  path.resolve(__dirname, '..', 'build'),
    authentication: {
        authSecret: process.env.AUTH_SECRET || 'auth_secret',
        refreshSecret: process.env.REFRESH_SECRET || 'refresh_secret',
        authTTL: THREE_MINUTES,
        refreshTTL: THIRTY_DAYS,
        saldRounds: 10
    },
    referrerPolicy: 'strict-origin',
    csp: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://www.googletagmanager.com'],
            imgSrc: ["'self'", 'https://www.googletagmanager.com'],
            frameAncestors: ["'self'", 'http://miotrapagina.com']
        }
    },
    allowedOrigins: [
        'https://www.google.com'
    ]
};