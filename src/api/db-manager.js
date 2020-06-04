class DBManager {
    constructor(db){
        this._db = db;
    }
    getAll(collection) {
        return this._db[collection];
    }
    find(collection, fn){
        return this._db[collection] && this._db[collection].find(fn)
    }
    getById(collection, id) {
        return this.find(collection, (entry) => {
            return entry.id === id
        });
    }
    create(collection, data) {
        if (!this._db[collection]) {
            return;
        }
        this._db[collection].push(data);
    }
}
module.exports = DBManager;