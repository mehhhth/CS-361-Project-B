// Loads the engines
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var request = require('request');
app.use(express.static('public'));

// Sets up the body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Sets up the engines
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 4003);

// Sets up the database on EC2
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});
var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
pool.query(createString)

// Displays the home page
app.get("/", function(req, res, next){
  var context = {};
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.render('home', context);
  });
});

// Adds items to the database
app.get("/addItem", function(req, res, next) {
  var context = {};

  // Ensures their is a name
  if (req.query.name == "" || req.query.name == null)
    res.send(null);
  
  // Adds the data to the table
  else
  {
    // Removes "" values in data
    if (req.query.reps == "")
      req.query.reps = null;
    if (req.query.weight == "")
      req.query.weight = null;
    if (req.query.date == "")
      req.query.date = null;

    pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?, ?, ?, ?, ?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
      if(err){
        next(err);
        return;
      }
      req.query.id = result.insertId;
      if (req.query.date != null) {
        pool.query("SELECT date FROM workouts WHERE id=?", [result.insertId], function(err, rows, fields) {
          req.query.date = rows[0].date.toString();
          res.send(req.query);
        });
      }
      else
        res.send(req.query);
    });
  }
});

// Deletes an entry
app.get('/delete-item', function(req, res, next){
  pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result) {
    if (err) {
      next(err);
      return;
    }
    res.send(null);
  });
});

// Creates the edit page
app.get('/edit-item', function(req, res, next){
  var context = {};
  // Gets the existing data
  pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, rows) {
    if (err) {
      next(err);
      return
    }
    var date = new Date(rows[0].date);
    var dateString = "";
    var day = date.getDate();
    if (day < 10)
      day = "0" + day;
    var month = date.getMonth() + 1;
    if (month < 10)
      month = "0" + month;
    dateString += date.getFullYear() + "-" + month + "-" + day;
    if (dateString == "1970-01-01")
      dateString = "";
    rows[0].date = dateString;
    context.results = rows[0];
    res.render('edit-item', context);
  });
});

// Edits the data in the database
app.get('/submit-edit-item', function(req, res, next) {
  var reqQ = req.query;
  if (reqQ.name != "") {
    if (reqQ.reps == "")
      reqQ.reps = null;
    if (reqQ.weight == "")
      reqQ.weight = null;
    if (reqQ.date == "")
      reqQ.date = null;
    pool.query("UPDATE workouts SET name=?, reps=?, weight=?, lbs=?, date=? WHERE id=?", 
      [reqQ.name, reqQ.reps, reqQ.weight, reqQ.lbs, reqQ.date, reqQ.id], function(err, result) {
        if (err) {
          next(err);
          return;
        }
        res.send(null);
      });
  }
  else
    res.send(null);
});

// Resets the table
app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

// Error page not found
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

// Error server error
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

// Starts the web page
app.listen(app.get('port'), function(){
  console.log("");
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
  console.log("");
});