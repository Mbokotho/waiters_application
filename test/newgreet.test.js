let greetService = require('../services/greeting');
 const assert = require('assert');

 const pg = require("pg");

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


 describe('Greeting widget', function(){

   beforeEach(async function(){

     await pool.query('delete from users');
   });




 it('Return number of all user in database', async function(){

   let getGreet =  greetService(pool);
  await getGreet.greeter('Lwando','Hello');
  await getGreet.greeter('King','Hello');
  await getGreet.greeter('Kong','Hello');
   let Greetedusers = await getGreet.readData();

   assert.equal( Greetedusers.length, 3);
});

it('Return number of times a user has been greeted', async function(){

  let getGreet =  greetService(pool);
await getGreet.greeter('Lwando','Hello');
await getGreet.greeter('Lwando','Hello');
await getGreet.greeter('Lwando','Hello');
await getGreet.greeter('Lwando','Hello');
await getGreet.greeter('Luko','Hello');

  let userRow = await getGreet.readUser('Lwando');

  // let upDated = readCount();

  assert.equal( userRow[0].greeted_count, 4);
});

after(function(){
  pool.end();

});

 });
