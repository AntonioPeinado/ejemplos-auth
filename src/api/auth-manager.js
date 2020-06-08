const jwt = require('./jwt');
class AuthManager {
    constructor(config) {
        this._config = config;
    }
    async login(user) {
        const authToken = await this._getAuthToken(user);
        const refreshToken = await this._getRefreshToken(user);
        return { authToken, refreshToken };
    }
    async refresh(refreshToken) {
        try {
            const payload = await jwt.verify(refreshToken, this._config.refreshSecret);
            return this._getAuthToken(payload.user);
        } catch (err) {
            console.error(err);
            return null;
        }
    }
    async verify(authToken) {
        try {
            const payload = await jwt.verify(authToken, this._config.authSecret);
            return payload.user;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
    _getAuthToken(user) {
        return jwt.sign({ user }, this._config.tokenSecret, {
            algorithm: 'HS512',
            expiresIn: this._config.tokenTTL
        });
    }
    _getRefreshToken(user) {
        return jwt.sign({ user }, this._config.refreshSecret, {
            algorithm: 'HS512',
            expiresIn: this._config.refreshTTL
        });
    }
}

module.exports = AuthManager;