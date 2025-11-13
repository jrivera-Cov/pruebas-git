// db.js conexión
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '99.90.128.245',
    database: 'prueba',
    password: 'rafa12',
    port: 5432,
});

pool.connect((err) => {
    if (err) {
        console.error('No le sabes D:', err);
    } else {
        console.log('Si le sabes :D');
    }
});

module.exports = pool;