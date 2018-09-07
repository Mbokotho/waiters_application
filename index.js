const express = require('express');

const app = express();

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');

const moment = require('moment');

const flash = require('express-flash');

const session = require('express-session');

// const Greeting = require('./Greet');

// const Set = Greeting();

let greetRoutes = require('./routes/greetings');

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


let getGreet =  greetRoutes(pool);

app.get('/', getGreet.home);
app.post('/greetings', getGreet.greetings);
app.get('/greeted', getGreet.greeted);
app.post('/reset', getGreet.Reset);
app.get('/counter/:username',getGreet.counter);

app.post('/clear', async function(req, res) {
  await pool.query('delete  from  Users');
  res.render('greeted');
});
app.post('/back', async function(req, res) {
  res.redirect('/');
});
app.post('/home', async function(req, res) {
  res.redirect('greeted');
});

let PORT = process.env.PORT || 3002;

app.listen(PORT, function() {
  console.log('App starting on port', PORT);
});
