module.exports = function (pool) {

    async function readData () {
        let result = await pool.query('select * from Users');
        return result.rows;
    }
    
    async function putData (username, language) {
        await pool.query('insert into Users (username,greeted_count,language) values ($1,$2,$3)', [username, 1, language]);
    }

    async function allCount () {
        let result = await pool.query('select count(*) from Users');
        return parseInt(result.rows[0].count);
    }

    async function upData (Person, newCount, language) {
        await pool.query('update Users set greeted_count =$1 ,language=$3 where username = $2', [newCount, Person, language]);
    }

    async function readUser (Person) {
        let personresult = await pool.query('select * from Users where username =$1', [Person]);
        return personresult.rows;
    }

    async function readCount (Person, curretCount) {
        return curretCount.rows[0].greeted_count + 1;
    }

    async function greeter (Person, language) {
        let user = await readUser(Person);
        if (user.length !== 0) {
            let newCount = user[0].greeted_count + 1;

            await upData(Person, newCount, language);
        } else {
            await putData(Person, language);
        }
        return language + ', ' + Person;
    }

    async function reset () {
        await pool.query('delete  from  Users');
    }

    return {
        readUser,
        readCount,
        allCount,
        readData,
        greeter,
        reset
    };
};
