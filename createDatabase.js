// Connects MySQL
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'student',
    password: 'default',
    database: 'student'
});

// Create the Database Table
var dropTable = "DROP TABLE IF EXISTS shelter, address";
pool.query(dropTable);
var createString = ""+
    "CREATE TABLE address("+
    "id INT PRIMARY KEY AUTO_INCREMENT, "+
    "unitNum INT, "+
    "street_num INT, "+
    "street_name VARCHAR(255), "+
    "city VARCHAR(255), "+
    "state VARCHAR(255), "+
    "zip_code INT "+
    ");"
    ;
pool.query(createString, function(err, rows, fields){
    // Checks for errors in address
    console.log("Errors Creating Address Table: " + err);
    // Prints SHOW COLUMNS
    pool.query("SHOW COLUMNS FROM address", function(err, rows, fields){
        console.log("Fields in address:");
        for (var c in rows) {
            console.log(JSON.stringify(rows[c]));
        }
        console.log("");
    });

    // Creates the shelter table
    createString = "" +
    "CREATE TABLE shelter("+
    "id INT PRIMARY KEY AUTO_INCREMENT, "+
    "name VARCHAR(255) NOT NULL, "+
    "address_id INT, "+
    "bed_total INT, "+
    "available INT, "+
    "time_open TIME, "+
    "time_close TIME" +
    ");"
    pool.query(createString, function(err, rows, fields){
        // Checks for errors in address
        console.log("Errors Creating Shelter Table: " + err);
        // Prints SHOW COLUMNS
        pool.query("SHOW COLUMNS FROM shelter", function(err, rows, fields){
            console.log("Fields in shelter:");
            for (var c in rows) {
                console.log(JSON.stringify(rows[c]));
            }
            console.log("");
        });
    });
    
});