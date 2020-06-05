module.exports = (req, res, next) => {
    res.cookie('csrfToken', req.csrfToken());
    next();
}