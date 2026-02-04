const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'garden.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS plants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )`
    );
});

function getPlants() {
    return new Promise((resolve, reject) => {
        db.all('SELECT id, name FROM plants', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function addPlant(name) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('INSERT INTO plants (name) VALUES (?)');
        stmt.run(name, function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, name });
        });
        stmt.finalize();
    });
}

function updatePlant(id, name) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE plants SET name = ? WHERE id = ?', [name, id], function(err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
        });
    });
}

function deletePlant(id) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM plants WHERE id = ?', [id], function(err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
        });
    });
}

module.exports = { getPlants, addPlant, updatePlant, deletePlant };