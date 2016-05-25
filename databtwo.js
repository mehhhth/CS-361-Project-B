var express = require('express');

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});


var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);


app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
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

app.get('/insert',function(req,res,next){
  var context = {};
  pool.query("INSERT INTO workouts (`name`, 'reps', 'weight', 'date', 'lbs') VALUES (?,?,?,?,?)", [req.query.c], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.render('home',context);
  });
});

app.get('/',function(req,res,next){
  var context = {};
  pool.query('SELECT * FROM todo', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.render('home', context);
  });
});

app.get('/safe-update',function(req,res,next){
  var context = {};
  pool.query("SELECT * FROM todo WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      pool.query("UPDATE todo SET name=?, done=?, due=? WHERE id=? ",
        [req.query.name || curVals.name, req.query.done || curVals.done, req.query.due || curVals.due, req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        context.results = "Updated " + result.changedRows + " rows.";
        res.render('home',context);
      });
    }
  });
});

app.get('/delete', function(req, res, next){
	var context = {};
	pool.query("DELETE FROM todo WHERE id=?", [reg,query.id], function(req,res,next){
	if(err){
	next(err);
	return;
	}
	context.results = "Deleted " + result.changedRows + " rows.";
	res.render('home', context);
	});
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});