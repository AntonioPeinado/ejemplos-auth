const {promisify} = require('util')
const jwt = require('jsonwebtoken');

module.exports = {
    sign: promisify(jwt.sign.bind(jwt)),
    verify: promisify(jwt.verify.bind(jwt))
};