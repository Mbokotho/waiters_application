 module.exports =function Greeting(){
  var Names = {};
  var greeting = "";
  var Name ="";

var myGreet = function(language,Name){
  var name = Name.toUpperCase();

    if (name != "") {

      if (Names[name] === undefined) {

        Names[name] = 0;

      }

    }


  if ( language === 'IsiXhosa') {
    greeting = "Mholo, " +  Name;
  }
  if (language === 'Mandarin') {

     greeting = "Nǐ hǎo, " + Name;

  } if ( language === 'English') {
      greeting = "Hello, " + Name;
  }
return  greeting;
}

 function mygreeting(){
  return greeting;
}

function myCounter() {
  return Object.entries(Names).length ;

}

function resetFunction() {

   Names = {};
   greeting = "";
   Name ="";

}

    return{
           mygreeting,
           myGreet,
           myCounter,
           resetFunction

       }

}
