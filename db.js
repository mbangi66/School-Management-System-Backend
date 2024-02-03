const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database('./mydatabase.db');

// Create a 'students' table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    grade TEXT,
    age INTEGER,
    subject TEXT
  )
`);

module.exports = db;
