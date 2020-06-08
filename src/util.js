function getOrigin(config){
    return `${config.protocol}://${config.host}:${config.port}`;
}

module.exports = {
    getOrigin
};