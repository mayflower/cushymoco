var settings = {
    db: null,
    init: function() {
        var db = Ti.Database.open('appDB');
        db.execute('CREATE TABLE IF NOT EXISTS settings (name TEXT PRIMARY KEY NOT NULL, value TEXT)');
        this.db = db;
    },
    get: function(name) {
        return this.db.execute('SELECT value FROM settings WHERE name = ? LIMIT 1', name).field(0);
    },
    getAll: function() {
        var rows = this.db.execute('SELECT name, value FROM settings');
        var result = [];
        while (rows.isValidRow()) {
            var name = rows.fieldByName('name');
            result[name] = rows.fieldByName('value');
            rows.next();
        }
        
        return result;
        
    },
    set: function(name, value) {
        realValue = value || '';
        this.db.execute('INSERT OR REPLACE INTO settings (name, value) VALUES (?, ?)', name, realValue);
    },
    "delete": function(name) {
        this.db.execute('DELETE FROM settings WHERE name = ?', name);
    },
    has:function(name) {
        rowCount = this.db.execute('SELECT COUNT(*) FROM settings WHERE name = ?', name).field(0);
        return rowCount > 0;
    }
};
exports = settings;