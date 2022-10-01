const mysql = require("mysql2");

//connection details to database
module.exports.dbConn = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "123@Lakshyaarora",
  database:"customdatabase",
  pooling: false
});
