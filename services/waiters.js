module.exports = function (pool) {
    async function readWaiter (user) {
        let result = await pool.query('select * from waiters where username = $1', [user]);
        return result.rowCount;
    }

    async function putWaiter (user) {
        let person = user.toUpperCase();
        let result = await pool.query('select * from waiters where username = $1', [person]);
        if (result.rowCount === 1) {

        } else { await pool.query('insert into waiters (username) values ($1)', [person]); }
    };

    async function readWaiterId (person) {
        let waiterId = await pool.query('select id from waiters where username = $1', [person]);
        return waiterId.rows[0].id;
    }
    async function readDay (Day) {
        if (Day === 'Monday') {
            result = await pool.query('SELECT id FROM shifts WHERE shift_day=$1', ['Monday']);
            let Id = result.rows;
            await pool.query(' select* from roster join waiters on waiter_id = waiters.id join shifts on shifts.id = shift_id where  shift_id=$1;', [Id]);
        }
        if (Day === 'Tuesday') {
            result = await pool.query('SELECT id FROM shifts WHERE shift_day=$1', ['Tuesday']);
            let Id = result.rows;
            await pool.query(' select* from roster join waiters on waiter_id = waiters.id join shifts on shifts.id = shift_id where  shift_id=$1;', [Id]);
        }
        if (Day === 'Wednesday') {
            result = await pool.query('SELECT id FROM shifts WHERE shift_day=$1', ['Wednesday']);
            let Id = result.rows;
            await pool.query(' select* from roster join waiters on waiter_id = waiters.id join shifts on shifts.id = shift_id where  shift_id=$1;', [Id]);
        }
        if (Day === 'Thursday') {
            result = await pool.query('SELECT id FROM shifts WHERE shift_day=$1', ['Thursday']);
            let Id = result.rows;
            await pool.query(' select* from roster join waiters on waiter_id = waiters.id join shifts on shifts.id = shift_id where  shift_id=$1;', [Id]);
        }
        if (Day === 'Friday') {
            result = await pool.query('SELECT id FROM shifts WHERE shift_day=$1', ['Friday']);
            let Id = result.rows;
            await pool.query(' select* from roster join waiters on waiter_id = waiters.id join shifts on shifts.id = shift_id where  shift_id=$1;', [Id]);
        }
        if (Day === 'Saturday') {
            result = await pool.query('SELECT id FROM shifts WHERE shift_day=$1', ['Saturday']);
            let Id = result.rows;
            await pool.query(' select* from roster join waiters on waiter_id = waiters.id join shifts on shifts.id = shift_id where  shift_id=$1;', [Id]);
        }
        if (Day === 'Sunday') {
            result = await pool.query('SELECT id FROM shifts WHERE shift_day=$1', ['Sunday']);
            let Id = result.rows;
            await pool.query(' select* from roster join waiters on waiter_id = waiters.id join shifts on shifts.id = shift_id where  shift_id=$1;', [Id]);
        }
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

    // async function readRoster (params) {
    // let Id = await
    //     let onDuty = await pool.query(' select* from roster join waiters on waiter_id = waiters.id join shifts on shifts.id = shift_id where  waiter_id=$1', [Id]);

    // }

    return {
        readWaiter,
        putWaiter,
        readWaiterId,
        putInRoster
        // readRoster

    };
};
