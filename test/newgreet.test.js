let greetService = require('../services/greeting');
const assert = require('assert');

const pg = require('pg');

const Pool = pg.Pool;

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/spMynames';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

describe('Greeting widget', function () {
    beforeEach(async function () {
        await pool.query('delete from users');
    });

    it('Should return number of all user in database', async function () {
        let getGreet = greetService(pool);
        await getGreet.greeter('Lwando', 'Hello');
        await getGreet.greeter('King', 'Hello');
        await getGreet.greeter('Kong', 'Hello');
        let Greetedusers = await getGreet.readData();

        assert.strict.equal(Greetedusers.length, 3);
    });

    it('Should return number of times  a given user has been greeted', async function () {
        let getGreet = greetService(pool);

        await getGreet.greeter('Lwando', 'Hello');
        await getGreet.greeter('Lwando', 'Hello');
        await getGreet.greeter('Lwando', 'Hello');
        await getGreet.greeter('Lwando', 'Hello');
        await getGreet.greeter('Luko', 'Hello');

        let userRow = await getGreet.readUser('Lwando');

        assert.strict.equal(userRow[0].greeted_count, 4);
    });

    it('Should greet a name in English', async function () {
        let getGreet = greetService(pool);
        let greeting = await getGreet.greeter('Lwando', 'Hello');

        assert.strict.equal(greeting, 'Hello, Lwando');
    });

    it('Should greet a name in Afrikaans', async function () {
        let getGreet = greetService(pool);
        let greeting = await getGreet.greeter('Lwando', 'Goeie dag');

        assert.strict.equal(greeting, 'Goeie dag, Lwando');
    });
    it('Should greet a name in isiXhosa', async function () {
        let getGreet = greetService(pool);
        let greeting = await getGreet.greeter('Lwando', 'Molo');

        assert.strict.equal(greeting, 'Molo, Lwando');
    });
    it('Should not count the same name twice', async function () {
        let getGreet = greetService(pool);
        await getGreet.greeter('Lwando', 'Hello');
        await getGreet.greeter('Lwando', 'Hello');
        await getGreet.greeter('Lwando', 'Hello');
        await getGreet.greeter('Lwando', 'Hello');
        let count = await getGreet.allCount();

        assert.strict.equal(count, 1);
    });

    after(function () {
        pool.end();
    });
});
