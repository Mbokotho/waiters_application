const express = require('express');

const app = express();

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');

const moment = require('moment');

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


app.get('/', function(){
    req.render('home');
});
app.post('/greetings', function(req, res){


})

let PORT = process.env.PORT || 3002;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});
