const express = require('express');

const app = express();

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');

const moment = require('moment');

const flash = require('express-flash');

const session = require('express-session');

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

app.get('/', async function (req, res) {
    res.render('days');
});

app.get('/waiters/:username', async function (req, res) {
    const user = req.params.username;
    // if (user !== '' && isNaN(user)) {
    let result = await pool.query('select * from waiters where username = $1', [user]);
    if (result.rowCount === 0) {
        await pool.query('insert into waiters (username) values ($1)', [user]);
    }
    req.flash('info', `${user} you are now on duty please click the button bellow to select your working days`);
    // }

    // console.log(user);
    res.render('days', { username: user
    });
});

app.post('/waiters/:username', async function (req, res) {
    const user = req.params.username;
    const workingDay = req.body.day;

    console.log(workingDay);

    let person = user.toUpperCase();

    let result = await pool.query('select * from waiters where username = $1', [person]);

    if (result.rowCount === 0) {
        await pool.query('insert into waiters (username) values ($1)', [person]);
        let waiterId = await pool.query('select id from waiters where username = $1', [person]);

        for (var j = 0; j < workingDay.length; j++) {
            console.log(workingDay[j]);
            let dayId = await pool.query('SELECT id FROM shifts WHERE shift_day=$1', [workingDay[j]]);
            result = await pool.query('INSERT INTO roster (waiter_id ,shift_id) VALUES ($1, $2)', [waiterId.rows[0].id, dayId.rows[0].id]);
        }
    }

    req.flash('info', `${user} you are now on duty please select your working days`);

    res.redirect('/waiters/' + user);
});

let PORT = process.env.PORT || 3030;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});
