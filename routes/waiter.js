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
            const workingDay = req.body.day;

            await getWaiter.putInRoster(user, workingDay);

            res.redirect('/waiters/' + user);
        } catch (err) {

        }
    }

    // async function greeted (req, res) {
    //     try {
    //         let names = await getGreet.readData();
    //         res.render('greeted', { names });
    //     } catch (err) {

    //     }
    // }
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
        secondWaiter
    };
};
