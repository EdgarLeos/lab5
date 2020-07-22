const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit: 10,
    host: "nj5rh9gto1v5n05t.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "zycu4482m9x5bazf",
    password: "j992f7boke7wkux7",
    database: "gnqplc28tnyarsjk"
});

module.exports = pool;
