module.exports = function (pool) {
    async function readWaiter (user) {
        let result = await pool.query('select * from waiters where username = $1', [user]);
        return result.rowCount;
    }

    async function putWaiter (user) {
        let person = user.toUpperCase();
        await pool.query('insert into waiters (username) values ($1)', [person]);
    };

    async function readWaiterId (person) {
        let waiterId = await pool.query('select id from waiters where username = $1', [person]);
        return waiterId.rows[0].id;
    }

    async function readDayId (workingDay) {
        if (typeof workingDay === 'string') {
            let dayId = await pool.query('SELECT id FROM shifts WHERE shift_day=$1', [workingDay]);
            return dayId.rows[0].id;
        } else {
            for (var j = 0; j < workingDay.length; j++) {
                let dayId = await pool.query('SELECT id FROM shifts WHERE shift_day=$1', [workingDay[j]]);
                return dayId.rows[0].id;
            }
        }
    };

    async function putInRoster (waiter, days) {
        let result = await pool.query('INSERT INTO roster (waiter_id ,shift_id) VALUES ($1, $2)', [waiter, days]);
    };

    // async function readPaarl(myTown){
    //     if (myTown ==='CJ') {
    //         result = await pool.query('select id from towns where town_id=$1',['CJ']);
    //         let id = result.rows[0].id
    //         const mytowns =  await pool.query('select reg from RegistrationNumbers where town_id =$1',[id]);
    //         let registrationN = mytowns.rows;
    //         return registrationN

    //     }
    // }

    // async function readAll(myTown){

    //  if (myTown ==='All') {
    //       let number = await pool.query('Select reg from RegistrationNumbers');
    //      let registrationN = number.rows;
    //      return registrationN
    //          }

    // };

    // async function Duplicates(reg_Number){
    //     let result = await pool.query('SELECT * FROM RegistrationNumbers WHERE reg=$1', [reg_Number]);
    //     if(result.rowCount === 1){
    //      return result.rows[0].reg ;
    //     }
    // }
    //     async function Invalid(regCode) {
    //         result = await pool.query('SELECT * FROM towns WHERE town_id=$1', [regCode]);
    //         return result.rowCount
    //     }

    return {
        readWaiter,
        putWaiter,
        readWaiterId,
        readDayId,
        putInRoster

    };
};
