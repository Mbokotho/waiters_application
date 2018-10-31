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
    let result = await pool.query('select * from waiters where username = $1', [user]);
    if (result.rowCount === 0) {
        await pool.query('insert into waiters (username) values ($1)', [user]);
    }

    res.render('days', { username: user
    });
});

app.post('/waiters/:username', async function (req, res) {
    const user = req.params.username;
    const workingDay = req.body.day;

    let person = user.toUpperCase();

    let result = await pool.query('select * from waiters where username = $1', [person]);

    if (result.rowCount === 0) {
        await pool.query('insert into waiters (username) values ($1)', [person]);
        let waiterId = await pool.query('select id from waiters where username = $1', [person]);

        for (var j = 0; j < workingDay.length; j++) {
            let dayId = await pool.query('SELECT id FROM shifts WHERE shift_day=$1', [workingDay[j]]);
            result = await pool.query('INSERT INTO roster (waiter_id ,shift_id) VALUES ($1, $2)', [waiterId.rows[0].id, dayId.rows[0].id]);
            let day = await pool.query('select waiter_id from roster where waiter_id =$1', [waiterId.rows[0].id]);
            console.log(day.rows[0].waiter_id);
            let onDuty = await pool.query(' select* from roster join waiters on waiter_id = waiters.id join shifts on shifts.id = shift_id where  waiter_id=$1', [waiterId.rows[0].id]);
            // console.log(onDuty);
            if (onDuty.rowCount === 3) {
                console.log(onDuty.rows);
            }
        }
    }

    res.redirect('/waiters/' + user);
});

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
