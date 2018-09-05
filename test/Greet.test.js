let assert = require("assert");
let Greeting = require("../Greet");

describe('Greeting widget', function(){

    it('Greet name in English', function(){

      var getGreet = Greeting();

      getGreet.myGreet("English", "Lwando");

      assert.equal( getGreet.mygreeting(), "Hello, Lwando");


});
it('Greet name in Mandarin', function(){

  var getGreet = Greeting();
  getGreet.myGreet("Mandarin", "Lwando");

  assert.equal( getGreet.mygreeting(), "Nǐ hǎo, Lwando");


});
it('Greet name in isiXhosa', function(){

  var getGreet = Greeting();
  getGreet.myGreet("IsiXhosa", "Lwando");

  assert.equal( getGreet.mygreeting(), "Mholo, Lwando");


});

it('should count how many people i have greeted', function(){

  var getGreet = Greeting();
  getGreet.myGreet("English", "Bontle");
  getGreet.myGreet("IsiXhosa", "Sihle");
  getGreet.myGreet("Mandarin", "Buhle");
  getGreet.myGreet("IsiXhosa", "Kuhle");
  assert.equal( getGreet.myCounter(), 4);
});




  it('should not count same name twice', function(){

    var getGreet = Greeting();
    getGreet.myGreet("English", "Bontle");
    getGreet.myGreet("IsiXhosa", "bontle");
    assert.equal( getGreet.myCounter(), 1);
  });



});
