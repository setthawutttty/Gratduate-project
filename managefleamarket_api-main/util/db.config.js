const mysql = require("mysql");

const db = mysql.createPool({
    host: "dns.komkawila.com",
    user: "managefleamarket",
    password: "P@ssw0rd",
    database: "managefleamarket_db"
});
module.exports = db;