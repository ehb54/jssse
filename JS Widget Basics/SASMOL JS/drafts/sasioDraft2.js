/**
 *  @fileOverview Basic I/O for reading/writing PDB files
 *
 *  @requires     NPM:numjs
 *  @requires     NPM:sprintf-js
 *  @requires     NPM:readline
 */
//dependencies
var sasmol = require('./sasmol.js');
//import numJS (like numpy)
var nj = require('numjs');
//import string formatter
var sprintf = require("sprintf-js").sprintf,
    vsprintf = require("sprintf-js").vsprintf;
//NodeJS core module definitions
//var fs = require('fs');
var fs = require('browserify-fs');
var readline = require('readline');

/**
 * Reads PDB Asynchronously
 * @param   {string} filename    local file name (in same directory)
 *
 * @returns {string} full file as string
 */
sasmol.SasMol.readPDB = function(filename){
//'use strict';
  //Sasmol load properties and local variables:
  var atomArr = [] ; //atom serial number
  var indexArr = [] ;
  var original_indexArr = [] ;
  var nameArr = [] ; //atom name
  var locArr = [] ;  //altloc
  var resnameArr = [] ; //resname
  var chainArr = [] ;  //chain id
  var residArr = [] ;  //residue seq number 23-26
  var rescodeArr = []; //icode
  var x = [];
  var y = [];
  var z = [];
  var coor =  [];// defined below
  var occupancyArr = [] ;  //occupancy
  var betaArr = [] ; //temp factor
  var segnameArr = [] ;  //segname
  var elementArr = [] ;  //elt symbol
  var chargeArr = [] ; //charge

  var fileStr = "";
  var frameCount = 1;
  var atomCount = 0;
  //capture instance of sasmol.SasMol class (this reference gets redefined to an Interface once the readline function starts doing its work)
  var that = this;
  var input = fs.createReadStream(filename, 'utf8');
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

    //append to return string
    fileStr = fileStr + line + "\n";
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
          atomArr.push(parseInt(result[1]));
        }

        nameArr.push(result[2]);
        locArr.push(result[3]);
        resnameArr.push(result[4]);
        chainArr.push(result[5]);
        residArr.push(parseInt(result[6]));
        rescodeArr.push(result[7]);



        //coor

        x.push(parseFloat(result[8]));
        y.push(parseFloat(result[9]));
        z.push(parseFloat(result[10]));
        var coorObj = {x: parseFloat(result[8]), y: parseFloat(result[9]), z: parseFloat(result[10])};
        //coor.push(coorObj);
        occupancyArr.push(parseFloat(result[11]));
        betaArr.push(parseFloat(result[12]));
        elementArr.push(result[14]);
        chargeArr.push(result[15]);
        segnameArr.push(result[13]);

        //use setters
       that.atom(atomArr);
       that.name(nameArr);
       that.loc(locArr);
       that.resname(resnameArr);
       that.chain(chainArr);
       that.resID(residArr);
       that.rescode(rescodeArr);

       that.occupancy(occupancyArr);
       that.beta(betaArr);
       that.elt(elementArr);
       that.charge(chargeArr);
       that.segname(segnameArr);
       //console.log(result[11]);

      }
      lineCount++;
    }


  });
  rl.on('close', function(){
    //handle other stuff
    for(var i = 0;i<frameCount;i++){
      for(var j = 0;j<atomCount;j++){
        //set x
        coor.set(i,j,0,x[j]);
        //set y
        coor.set(i,j,1,y[j]);
        //set z
        coor.set(i,j,2,z[j]);
      }
    }
    that.coor(coor);
    //use numjs coor for data storage, coorObj as alternative for accessing xyz fields easier
    var coorObj = {x: x, y: y, z: z};
    that.coorObj(coorObj);
    return fileStr;
  });
}//end of readpdb

/**
 * Reads PDB synchronously
 * @param   {string} filename    local file name (in same directory)
 *
 * @returns {string} full file as string
 */
sasmol.SasMol.readPDBSync = function(filename){
  var linesArr = fs.readFileSync(filename, 'utf-8').split('\n').filter(Boolean);
  var linesArrLen = linesArr.length;
  //Sasmol load properties and local variables:
  var atomArr = [] ; //atom serial number
  var indexArr = [] ;
  var original_indexArr = [] ;
  var nameArr = [] ; //atom name
  var locArr = [] ;  //altloc
  var resnameArr = [] ; //resname
  var chainArr = [] ;  //chain id
  var residArr = [] ;  //residue seq number 23-26
  var rescodeArr = []; //icode
  var x = [];
  var y = [];
  var z = [];
  var coor =  [];// defined below
  var occupancyArr = [] ;  //occupancy
  var betaArr = [] ; //temp factor
  var segnameArr = [] ;  //segname
  var elementArr = [] ;  //elt symbol
  var chargeArr = [] ; //charge

  var fileStr = "";
  var frameCount = 1;
  var atomCount = 0;

  var errCount = 0;
  var errors = "";

  coor = nj.zeros([frameCount, atomCount, 3], 'float32');
  //console.log(coor);


  for(var i = 0; i<linesArrLen;i++){
    var atomCheck = /^ATOM\s/;
    var atomParse = /^ATOM\s{2}(.{5})\s(.{4})(.)(.{3})\s(.)(.{4})(.)\s{3}(.{8})(.{8})(.{8})(.{6})(.{6})\s{6}(.{4})(.{2})(.{2})/g;

    if(atomCheck.test(linesArr[i])){
      var result = atomParse.exec(linesArr[i]);
      //console.log(result);

      //if regex can't match, format is incorrect so throw error
      if(result == null){
        //is this the right error?
        errors += "Lines in PDB file has incorrect length (line " + i + ')\n';
      }



      //else assign properties to SASMOL object
      else{
        //append to return string
        fileStr = fileStr + linesArr[i] + "\n";

        //trim spaces (inside else block or else result length undefined error gets returned)
        for(var j = 0;j<result.length;j++){
          result[j] = result[j].trim();
        }
        if(isNaN(parseInt(result[1]))){
          errors += "Line " + i + "has invalid atom number\n";
        }
        else{
          atomArr.push(parseInt(result[1]));
        }

        nameArr.push(result[2]);
        locArr.push(result[3]);
        resnameArr.push(result[4]);
        chainArr.push(result[5]);
        residArr.push(parseInt(result[6]));
        rescodeArr.push(result[7]);



        //coor

        x.push(parseFloat(result[8]));
        y.push(parseFloat(result[9]));
        z.push(parseFloat(result[10]));
        var coorObj = {x: parseFloat(result[8]), y: parseFloat(result[9]), z: parseFloat(result[10])};
        //coor.push(coorObj);
        occupancyArr.push(parseFloat(result[11]));
        betaArr.push(parseFloat(result[12]));
        elementArr.push(result[14]);
        chargeArr.push(result[15]);
        segnameArr.push(result[13]);

        //use setters
       this.atom(atomArr);
       this.name(nameArr);
       this.loc(locArr);
       this.resname(resnameArr);
       this.chain(chainArr);
       this.resID(residArr);
       this.rescode(rescodeArr);

       this.occupancy(occupancyArr);
       this.beta(betaArr);
       this.elt(elementArr);
       this.charge(chargeArr);
       this.segname(segnameArr);

     }
   }
  }

  for(var i = 0;i<frameCount;i++){
    for(var j = 0;j<atomCount;j++){
      //set x
      coor.set(i,j,0,x[j]);
      //set y
      coor.set(i,j,1,y[j]);
      //set z
      coor.set(i,j,2,z[j]);
    }
  }
  this.coor(coor);
  //use numjs coor for data storage, coorObj as alternative for accessing xyz fields easier
  var coorObj = {x: x, y: y, z: z};
  this.coorObj(coorObj);

  return fileStr;
}

/**
 * writes PDB Asynchronously
 *
 * @returns {string} full file as string
 */
//return string instead of console logging
sasmol.SasMol.writePDB = function(){
  var numAtoms = this.data.atom.length;
  var fileStr = "";
  //debugging
  //console.log("          1         2         3         4         5         6         7         \n");
  //console.log("01234567890123456789012345678901234567890123456789012345678901234567890123456789\n");
  for(var i = 0; i<numAtoms;i++){
    fileStr += vsprintf("%-6s%5s %-4s%1s%-4s%1s%4s%1s   %8s%8s%8s%6s%6s      %-4s%2s%2s\n", ["ATOM",this.getAtom()[i],this.getName()[0],this.getLoc()[0],this.getResname()[0],this.getChain()[0],this.getResID()[0],this.getRescode()[0],this.getCoorObj().x[0].toFixed(3),this.getCoorObj().y[0].toFixed(3),this.getCoorObj().z[0].toFixed(3),this.getOccupancy()[0].toFixed(2),this.getBeta()[0].toFixed(2),this.getSegname()[0],this.getElt()[0],this.getCharge()[0]]);

  }

  //write to file for debugging
  fs.writeFile('res.pdb',fileStr, function(err){

    //callback after finishing reading file
    if(err){throw err;}

    //console.log('done writing');
  });


  //console.log(fileStr);
  return fileStr;
}
/**
 * writes PDB Asynchronously
 *
 * @returns {string} full file as string
 */
sasmol.SasMol.writePDBSync = function(){
  var numAtoms = this.data.atom.length;
  var fileStr = "";
  //debugging
  //console.log("          1         2         3         4         5         6         7         \n");
  //console.log("01234567890123456789012345678901234567890123456789012345678901234567890123456789\n");
  for(var i = 0; i<numAtoms;i++){
    fileStr += vsprintf("%-6s%5s %-4s%1s%-4s%1s%4s%1s   %8s%8s%8s%6s%6s      %-4s%2s%2s\n", ["ATOM",this.getAtom()[i],this.getName()[0],this.getLoc()[0],this.getResname()[0],this.getChain()[0],this.getResID()[0],this.getRescode()[0],this.getCoorObj().x[0].toFixed(3),this.getCoorObj().y[0].toFixed(3),this.getCoorObj().z[0].toFixed(3),this.getOccupancy()[0].toFixed(2),this.getBeta()[0].toFixed(2),this.getSegname()[0],this.getElt()[0],this.getCharge()[0]]);

  }
  fs.writeFileSync('res.pdb', fileStr);

  return fileStr;
}


//DEBUG CODE HERE
// var newObj = Object.create(sasmol.SasMol);
// //newObj.readPDB('1AA-NoEND.pdb');
// //newObj.readPDB('6djx.pdb');
//
// //newObj.readPDBSync('1AA-NoEND.pdb');
// newObj.readPDBSync('6djx.pdb');
// var str = newObj.writePDBSync();
// //console.log("str: \n"+str);
// var newObj2 = Object.create(sasmol.SasMol);
// newObj2.readPDBSync('res.pdb');
//
// var str2 = newObj2.writePDBSync();
// //console.log("str2: \n"+str2);
//
// //result
// console.log("Str1 = str2?: "+(str==str2));

//MAIN
var newObj = Object.create(sasmol.SasMol);
newObj.readPDB('6djx.pdb');
module.exports = {newObj};
