let greetService = require('../services/greeting');

module.exports = function(pool) {
 let getGreet =  greetService(pool);

    async function home(req, res) {

      try{
          let count = await getGreet.allCount();
          res.render('home', {count});
        }
      catch(err){
      }

}

async function greetings(req, res) {
  try{
    const Name = req.body.Name;
    const language = req.body.language;

    let Person = Name.toUpperCase();

    if (Name === '' && language === undefined) {
      req.flash('info', 'Please Enter a Name and Select a Language !')

    } else if (Name === '') {
      req.flash('info', 'Please Enter a Name ')

    } else if (language === undefined) {
      req.flash('info', 'Please Select a Languge')

    } else if(isNaN(Person)){
      await getGreet.greeter(Person,language);
     req.flash('info', language + ", " + Person );

      }

    res.redirect('/');
  }
  catch(err){

  }

}

async function greeted(req, res) {
  try{
    let names = await getGreet.readData();
    res.render('greeted', {names});

  }catch(err){

  }

}
async function counter(req, res) {
  try{
  let username = req.params.username;
  let results = await  getGreet.readUser(username)
  res.render('names', {times: results });
  } catch(err){
    res.send(err.stack)
  }
}


async function Reset(req,res) {
  try{
    await getGreet.reset();
    res.redirect('/');
  } catch(err){

  }

}

return {
  home,
  greetings,
  greeted,
  Reset,
  counter
}
}
