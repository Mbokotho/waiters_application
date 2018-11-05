module.exports = function (pool) {
    async function readWaiter (user) {
        let result = await pool.query('select * from waiters where username = $1', [user]);
        return result.rowCount;
    }

    async function putWaiter (user) {
        let person = user.toUpperCase();
        let result = await pool.query('select * from waiters where username = $1', [person]);
        if (result.rowCount === 1) {

        }
        else { await pool.query('insert into waiters (username) values ($1)', [person]); }
    };

    async function readWaiterId (person) {
        let waiterId = await pool.query('select id from waiters where username = $1', [person]);
        return waiterId.rows[0].id;
    }

    async function putInRoster (user, workingDay) {
        let waiterId = await pool.query('select id from waiters where username = $1', [user]);

        if (typeof workingDay === 'string') {
            let dayId = await pool.query('SELECT id FROM shifts WHERE shift_day=$1', [workingDay]);
            result = await pool.query('INSERT INTO roster (waiter_id ,shift_id) VALUES ($1, $2)', [waiterId.rows[0].id, dayId.rows[0].id]);
        } else {
            for (var j = 0; j < workingDay.length; j++) {
                let dayId = await pool.query('SELECT id FROM shifts WHERE shift_day=$1', [workingDay[j]]);
                result = await pool.query('INSERT INTO roster (waiter_id ,shift_id) VALUES ($1, $2)', [waiterId.rows[0].id, dayId.rows[0].id]);
            };
        }
    }
    
    return {
        readWaiter,
        putWaiter,
        readWaiterId,
        putInRoster

    };
};
