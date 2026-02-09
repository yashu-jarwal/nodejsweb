// dbConfig.js
// const mysql = require('mysql2');
// var sql = require("mysql");
const mysql = require('mysql');
// Create a connection pool
// const pool = sql.createPool({
//     host: 'localhost',
//     user: 'your_username',
//     password: 'your_password',
//     database: 'your_database'
// });
const pool = mysql.createPool({
    "user": "root", // Database username
    "password": "yashu1437", // Database password
    "server": "localhost", // Server IP address
    "database": "gst", // Database name
    "options": {
        "encrypt": false // Disable encryption
    }
})

// Promisify the pool query method
// const promisePool = pool.promise();

module.exports = pool;
