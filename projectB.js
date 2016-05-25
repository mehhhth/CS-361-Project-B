// Loads the engines
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var request = require('request');
app.use(express.static('public'));


// Sets up the engines
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 4004);

// Sets up the body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connects MySQL
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'student',
    password: 'default',
    database: 'student'
});

// Checks connection to database
pool.query("SELECT * FROM shelter", function(err){
  console.log("Errors in connecting to shelter: " + err);
});

// Create user website
app.get("/user-page", function(req, res){
  res.status(200);
  //res.render('user-page');
  res.render('user');
});

// Create provider website
app.get("/provider-page", function(req, res){
  res.status(200);
  res.render('provider');
});

// Adds providers to the database
app.post("/add-provider", function(req, res){
  body = req.body;
  pool.query("INSERT INTO shelter (name, bed_total, available) VALUES (?, ?, ?)",
    [body.name, body.bedT, body.bedA]);
  pool.query("SELECT * FROM shelter WHERE name = ?", [body.name], function(err, rows, fields) {
    console.log(rows);
  });
});

// Create provider website
app.get("/cover", function(req, res){
  res.status(200);
  res.render('cover');
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

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});