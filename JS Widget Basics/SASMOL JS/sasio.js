
// window.onload = function(){
//   //handling local files
//   function handleFileSelect(e) {
//     var files = e.target.files; // FileList object (list of File objects)
//     var file = files[0];
//     var reader = new FileReader();
//     reader.onload = function (evt){
//       //grabs info
//       var info = evt.target.result;
//       //create jspdb object
//       //var obj3 = jspdb.create('fakediv',{});
//       console.log(info);
//       //jspdb.load(obj3, info, function(err){if(err){throw err;}});
//     }
//     reader.readAsText(file);
//
//
//   }
//
//   document.getElementById('files').addEventListener('change', handleFileSelect, false);
// }

var sasmol = require('./sasmol.js');
//import {SasMol} from 'sasmol'

//NodeJS core module definitions
var fs = require('fs');
var readline = require('readline');

//console.log('hello world');

var input = fs.createReadStream('1AA-NoEND.pdb', 'utf8');
var rl = readline.createInterface({
  input: input,
  output:process.stdout,
  terminal:false
});
//readline
rl.on('line',function(line){
  var atomParse = /^(ATOM)/g;
  //only deal with ATOM's
  if(atomParse.test(line)){
    console.log("ATOM LINE MATCHED => " + line);
    //console.log(sasmol.SasMol.getAtom());
    var result = atomParse.exec(line);
    console.log(result);
  }

});
rl.on('close', function(){
  console.log('done reading.');
});
