const uuid = require('uuid');

class SessionManager {
    constructor(store, options) {
        this._store = store;
        this._options = options;
    }
    create(userId) {
        const authToken = uuid.v4();
        const refreshToken = uuid.v4();
        this._store.mset([
            { key: authToken, value: userId, ttl: this._options.authTTL },
            { key: refreshToken, value: userId, ttl: this._options.refreshTTL }
        ]);
        return {
            authToken,
            refreshToken
        };
    }
    remove(authToken, refreshToken) {
        const tokensToDelete = [];
        if (authToken){
            tokensToDelete.push(authToken);
        }
        if(refreshToken) {
            tokensToDelete.push(refreshToken);
        }
        this._store.del(tokensToDelete);
    }
    canRefresh(refreshToken) {
        return this._store.has(refreshToken);
    }
    isAuthorized(authToken) {
        return this._store.has(authToken);
    }
    refresh(refreshToken) {
        const userId = this._store.get(refreshToken);
        return this.create(userId);
    }
    getUserId(authToken) {
        return this._store.get(authToken);
    }
}

module.exports = SessionManager;