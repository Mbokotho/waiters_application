let waiterService = require('../services/waiters');

module.exports = function (pool) {
    let getWaiter = waiterService(pool);

    async function waiter (req, res) {
        try {
            const user = req.params.username;
            await getWaiter.putWaiter(user);
            res.render('days', { username: user });
        } catch (err) {
        }
    }

    async function secondWaiter (req, res) {
        try {
            const waiter = req.params.username;
            let user = waiter.toUpperCase();
            let workingDay = req.body.day;

            await getWaiter.putInRoster(user, workingDay);

            // let onDuty = await getWaiter.readRoster(workingDay);
            // console.log(onDuty);
            // let duty = await getWaiter.waitersWorking(onDuty);
            // console.log(duty);

            res.redirect('/waiters/' + user);
        } catch (err) {

        }
    }

    async function day (req, res) {
        try {
            const workingDay = req.body.myDay;
            let onDuty = await getWaiter.readRoster(workingDay);

            // let names = await getWaiter.waitersWorking(onDuty);
            // console.log(names);
            
            res.render('day', { onDuty });
        } catch (err) {

        }
    }
    // async function counter (req, res) {
    //     try {
    //         let username = req.params.username;
    //         let results = await getGreet.readUser(username);
    //         res.render('names', { times: results });
    //     } catch (err) {
    //         res.send(err.stack);
    //     }
    // }

    // async function Reset (req, res) {
    //     try {
    //         await getGreet.reset();
    //         res.redirect('/');
    //     } catch (err) {

    //     }
    // }

    return {

        waiter,
        secondWaiter,
        day
    };
};
