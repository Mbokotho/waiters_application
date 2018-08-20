const express = require('express');

const app = express();

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');

const moment = require('moment');

const Greeting = require('./Greet');
const Set = Greeting();


app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers:
   {
    "timestamp": function()
    {
      return moment(this.timestamp).fromNow();
    }
  }
}));

app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/', function (req, res) {

const greet = Set.mygreeting();
const count = Set.myCounter();
res.render('home', {greet,count

});

});

app.post('/greetings', function(req, res){
  const Name = req.body.Name;
  const language = req.body.language;

Set.myGreet(language,Name);
console.log( Set.myGreet(language,Name));
  res.redirect('/');

});


let PORT = process.env.PORT || 3002;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});
