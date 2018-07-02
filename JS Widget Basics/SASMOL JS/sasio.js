
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
//import numJS (like numpy)
var nj = require('numjs');
//NodeJS core module definitions
var fs = require('fs');
var readline = require('readline');


//Sasmol load properties :
var atom = [] ; //atom serial number
var index = [] ;
var original_index = [] ;
var name = [] ; //atom name
var loc = [] ;  //altloc
var resname = [] ; //resname
var chain = [] ;  //chain id
var resid = [] ;  //residue seq number 23-26
var rescode = []; //icode
var x = [];
var y = [];
var z = [];
var coor =  [];// defined below
var occupancy = [] ;  //occupancy
var beta = [] ; //temp factor
var segname = [] ;  //segname
var element = [] ;  //elt symbol
var charge = [] ; //charge

var frameCount = 1;
var atomCount = 0;


//first read run - count number of atoms, number of frames, etc

var input = fs.createReadStream('1AA-NoEND.pdb', 'utf8');
var rl = readline.createInterface({
  input:  input,
  output: process.stdout,
  terminal:false
});

rl.on('line', function(line){
  var atomCheck = /^ATOM\s/;
  if(atomCheck.test(line)){
    atomCount++;
  }
});
rl.on('close', function(){
  //console.log('done with first round');
  //console.log('atom count'+atomCount);
});


//SECOND PASS - load data
rl = readline.createInterface({
  input:  input,
  output: process.stdout,
  terminal:false
});

//readline
rl.on('line',function(line){
  coor = nj.zeros([frameCount, atomCount, 3], 'float32');
  //console.log(coor);

  var atomCheck = /^ATOM\s/;
  var atomParse = /^ATOM\s{2}(.{5})\s(.{4})(.)(.{3})\s(.)(.{4})(.)\s{3}(.{8})(.{8})(.{8})(.{6})(.{6})\s{6}(.{4})(.{2})(.{2})/g;

  var lineCount = 0;
  var errCount = 0;
  var errors = "";

  //only deal with ATOM's
  //IMPORTANT NOTE : test advances lastIndex of the regex's with the global flag
  if(atomCheck.test(line)){
    var result = atomParse.exec(line);
    //console.log(result);

    //if regex can't match, format is incorrect so throw error
    if(result == null){
      //is this the right error?
      errors += "Lines in PDB file has incorrect length (line " + lineCount + ')\n';
    }



    //else assign properties to SASMOL object
    else{

      //trim spaces (inside else block or else result length undefined error gets returned)
      for(var i = 0;i<result.length;i++){
        result[i] = result[i].trim();
      }
      if(isNaN(parseInt(result[1]))){
        errors += "Line " + lineCount + "has invalid atom number\n";
      }
      else{
        atom.push(parseInt(result[1]));
      }

      name.push(result[2]);
      loc.push(result[3]);
      resname.push(result[4]);
      chain.push(result[5]);
      resid.push(parseInt(result[6]));
      rescode.push(result[7]);



      //coor

      x.push(parseFloat(result[8]));
      y.push(parseFloat(result[9]));
      z.push(parseFloat(result[10]));
      //var coorObj = {x: parseFloat(result[8]), y: parseFloat(result[9]), z: parseFloat(result[10])};
      //coor.push(coorObj);
      occupancy.push(parseFloat(result[11]));
      beta.push(parseFloat(result[12]));
      element.push(result[13]);
      charge.push(result[14]);
      segname.push(result[15]);

      //use setters
     sasmol.SasMol.atom(atom);
     sasmol.SasMol.name(name);
     sasmol.SasMol.loc(loc);
     sasmol.SasMol.resname(resname);
     sasmol.SasMol.chain(chain);
     sasmol.SasMol.resID(resid);
     sasmol.SasMol.rescode(rescode);
     sasmol.SasMol.coor(coor);
     sasmol.SasMol.occupancy(occupancy);
     sasmol.SasMol.beta(beta);
     sasmol.SasMol.elt(element);
     sasmol.SasMol.charge(charge);
     sasmol.SasMol.segname(segname);


    }
    //console.log(JSON.stringify(x));
    //console.log(JSON.stringify(sasmol.SasMol.data.coor));
    lineCount++;
  }


});

rl.on('close', function(){
  //handle other stuff
  x = nj.array(x, 'float32');
  y = nj.array(y, 'float32');
  z = nj.array(z, 'float32');
  console.log(coor.slice(frameCount-1,0,2));
  coor[frameCount-1,null,0] = x;
  coor[frameCount-1,null,1] = y;
  coor[frameCount-1,null,2] = z;
  console.log(coor[frameCount-1,null,0]);
  // console.log(JSON.stringify(coor));
  console.log('done reading.');
});
