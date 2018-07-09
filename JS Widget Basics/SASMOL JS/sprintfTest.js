var sprintf = require("sprintf-js").sprintf,
    vsprintf = require("sprintf-js").vsprintf;

sprintf("%2$s %3$s a %1$s", "cracker", "Polly", "wants");
vsprintf("The first 4 letters of the english alphabet are: %s, %s, %s and %s", ["a", "b", "c", "d"]);

var bob = vsprintf("%6s      %-4s%2s%2s",["0.00", "PCLN", " N"," "]);
console.log(bob);
