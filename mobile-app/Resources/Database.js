var Database = function(globals) {
    var db = Titanium.Database.open('appDB');
    db.execute('CREATE TABLE IF NOT EXISTS setting (name TEXT PRIMARY KEY NOT NULL, value TEXT)');

    globals._.each(require('settings').settings, function(value, name) {
        db.execute('INSERT OR REPLACE INTO setting VALUES (?, ?)', name, value);
    });

    var rows = db.execute('SELECT * FROM setting WHERE name = ?', 'staySignedIn');
    var staySignedIn = false;
    if (rows.rowCount == 1) {
        staySignedIn = globals.parseBoolean(rows.fieldByName('value'));
    }

    if (!staySignedIn) {
        db.execute(
            'DELETE FROM setting WHERE name IN (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            'loginname', 'session', 'cookie', 'username', 'firstname', 'lastname',
            'employee_firstname', 'employee_lastname', 'employee_phone1', 'employee_phone2',
            'employee_skype', 'employee_email'
        );
    }

    this._db = db;
    this.globals = globals;
};
Database.prototype.getSetting = function(name) {
    var rows = null;
    if (undefined !== name && null !== name) {
        rows = this._db.execute('SELECT * FROM setting WHERE name = ?', name);
    } else {
        rows = this._db.execute('SELECT * FROM setting');
    }

    if (rows.rowCount == 1) {
        return rows.fieldByName('value');
    } else if (rows.rowCount > 1) {
        var result = [];
        while (rows.isValidRow()) {
            var name = rows.fieldByName('name');
            var value = rows.fieldByName('value');
            result[name] = value;
            rows.next();
        }
        return result;
    } else {
        return null;
    }
};
Database.prototype.setSetting = function(name, value) {
    if (undefined !== value && null !== value) {
        this._db.execute('INSERT OR REPLACE INTO setting VALUES (?, ?)', name, value);
    } else {
        this._db.execute('DELETE FROM setting WHERE name = ?', name);
    }
};
exports.Database = Database;
