const express = require('express');

const app = express();

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');

const moment = require('moment');

const flash = require('express-flash');

const session = require('express-session');
let waiterRoutes = require('./routes/waiter');



const pg = require('pg');

const Pool = pg.Pool;

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://coder:pg123@localhost:5432/waiters';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

app.engine(
    'handlebars',
    exphbs({
        defaultLayout: 'main',
        helpers: {
            timestamp: function () {
                return moment(this.timestamp).fromNow();
            }
        }
    })
);

app.set('view engine', 'handlebars');
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(
    session({
        secret: '<add a secret string here>',
        resave: false,
        saveUninitialized: true
    })
);

app.use(flash());

let getWaiter = waiterRoutes(pool);

app.get('/', async function (req, res) {
    res.render('days');
});

app.get('/waiters/:username', getWaiter.waiter);

app.post('/waiters/:username', getWaiter.secondWaiter);

app.get('/day', async function (req, res) {
    let name = await pool.query('select * from shifts');
    let names = name.rows;
    res.render('day', { names });
});

app.post('/roster', async function (req, res) {
    res.redirect('day');
});
let PORT = process.env.PORT || 3030;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});
