const express = require('express');

const app = express();

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');

const moment = require('moment');

const flash = require('express-flash');

const session = require('express-session');

const Greeting = require('./Greet');

const Set = Greeting();

const pg = require("pg");

const Pool = pg.Pool;

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/spMynames';

const pool = new Pool({
  connectionString,
  ssl: useSSL
});


app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    "timestamp": function() {
      return moment(this.timestamp).fromNow();
    }
  }
}));

app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static('public'));


app.use(session({
  secret: "<add a secret string here>",
  resave: false,
  saveUninitialized: true
}));

app.use(flash());



app.get('/', async function(req, res) {

  let greet = Set.mygreeting();

  let count = await pool.query('select count(username) from Users');
  count = count.rows[0].count;
  res.render('home', {
    greet,
    count

  });

});

app.post('/greetings', async function(req, res) {

  const Name = req.body.Name;
  const language = req.body.language;

  if (Name === '' && language === undefined) {
    req.flash('info', 'Please Enter a Name and Select a Language !')

  } else if (Name === '') {
    req.flash('info', 'Please Enter a Name ')

  } else if (language === undefined) {
    req.flash('info', 'Please Select a Languge')

  } else {


    let person = await pool.query('select * from Users where username =$1', [Name])
    if (person.rows.length != 0) {
      let currentCount = await pool.query('select greeted_count from Users where username = $1', [Name]);
      let newCount = currentCount.rows[0].greeted_count + 1;
      await pool.query('update Users set greeted_count =$1 where username = $2', [newCount, Name]);
    } else {
      // await pool.query('insert into Users (username,greeted_count) values ($1,$2)', [Name, 1]);

      await pool.query('insert into Users (username,greeted_count) values ($1,$2)', [Name, 1]);
      Set.myGreet(language, Name);

    }
  }
  res.redirect('/');
});


app.get('/greeted', async function(req, res) {
  let results = await pool.query('select * from  Users');
  let names = results.rows;
  res.render('greeted', {
    names
  });
});


app.post('/reset', async function(req, res) {
  // Set.resetFunction();
  await pool.query('delete  from  Users');

  res.redirect('/');
});


//
// app.get('/counter/:username', async function(req, res) {
//   let username = req.params.Name;
//
//   let person = await pool.query('select * from Users where username =$1' ,[username])
//   if (person.rows.length!=0) {
//     let currentCount = await pool.query('select greeted_count from Users where username =$1', [username]);
//     let newCount = currentCount.rows[0].greeted_count +1;
//     await pool.query('update Users set greeted_count =$1 where username = $2', [newCount,username]);
//   }
//   else{
//     await pool.query('insert into Users (username,greeted_count) values ($1,$2)', [username, 1]);
//   }
//
//   count = count.rows[0];
//   console.log(count);
//   let times = `Hello,${username} has been greeted ${count} times`;
//
//   res.render('names', {
//     times
//   });
// });



let PORT = process.env.PORT || 3002;

app.listen(PORT, function() {
  console.log('App starting on port', PORT);
});


//
// router.post('/api/v1/todos', (req, res, next) => {
//   const results = [];
//   // Grab data from http request
//   const data = {text: req.body.text, complete: false};
//   // Get a Postgres client from the connection pool
//   pg.connect(connectionString, (err, client, done) => {
//     // Handle connection errors
//     if(err) {
//       done();
//       console.log(err);
//       return res.status(500).json({success: false, data: err});
//     }
//     // SQL Query > Insert Data
//     client.query('INSERT INTO items(text, complete) values($1, $2)',
//     [data.text, data.complete]);
//
//     // SQL Query > Select Data
//     const query = client.query('SELECT * FROM items ORDER BY id ASC');
//     // Stream results back one row at a time
//     query.on('row', (row) => {
//       results.push(row);
//     });
//     // After all data is returned, close connection and return results
//     query.on('end', () => {
//       done();
//       return res.json(results);
//     });
//   });
// });
//
//
//
// Read
// router.get('/api/v1/todos', (req, res, next) => {
//   const results = [];
//   // Get a Postgres client from the connection pool
//   pg.connect(connectionString, (err, client, done) => {
//     // Handle connection errors
//     if(err) {
//       done();
//       console.log(err);
//       return res.status(500).json({success: false, data: err});
//     }
//     // SQL Query > Select Data
//     const query = client.query('SELECT * FROM items ORDER BY id ASC;');
//     // Stream results back one row at a time
//     query.on('row', (row) => {
//       results.push(row);
//     });
//     // After all data is returned, close connection and return results
//     query.on('end', () => {
//       done();
//       return res.json(results);
//     });
//   });
// });
//
//
// Update
// router.put('/api/v1/todos/:todo_id', (req, res, next) => {
//   const results = [];
//   // Grab data from the URL parameters
//   const id = req.params.todo_id;
//   // Grab data from http request
//   const data = {text: req.body.text, complete: req.body.complete};
//   // Get a Postgres client from the connection pool
//   pg.connect(connectionString, (err, client, done) => {
//     // Handle connection errors
//     if(err) {
//       done();
//       console.log(err);
//       return res.status(500).json({success: false, data: err});
//     }
//     // SQL Query > Update Data
//     client.query('UPDATE items SET text=($1), complete=($2) WHERE id=($3)',
//     [data.text, data.complete, id]);
//     // SQL Query > Select Data
//     const query = client.query("SELECT * FROM items ORDER BY id ASC");
//     // Stream results back one row at a time
//     query.on('row', (row) => {
//       results.push(row);
//     });
//     // After all data is returned, close connection and return results
//     query.on('end', function() {
//       done();
//       return res.json(results);
//     });
//   });
// });
