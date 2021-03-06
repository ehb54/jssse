
/**
 *  @fileoverview Class Definition and basic I/O for reading/writing PDB files
 *
 *  @requires     NPM:numjs
 *  @requires     NPM:sprintf-js
 */
 /**
  * @module SasMol
  */
//DEPENDENCIES:
//import numJS (like numpy)
var nj = require('numjs');
//import string formatter
var sprintf = require("sprintf-js").sprintf,
    vsprintf = require("sprintf-js").vsprintf;

/**
 * SasMol Class definition
 * @namespace
 * @prop    {Object}    data    holder of all relevant PDB data
 * @prop    {Number[]}  data.atom    array of atom serial numbers
 * @prop    {Number[]}  data.index   (UNDEFINED)
 * @prop    {Number[]}  data.original_index  (UNDEFINED)
 * @prop    {String[]}  data.name    atom name
 * @prop    {String[]}  data.loc     loc
 * @prop    {String[]}  data.resname Residue name
 * @prop    {String[]}  data.chain   Chain id
 * @prop    {Number[]}  data.resid   residue sequence number
 * @prop    {String[]}  data.rescode iCode
 * @prop    {Object}    data.coor    numjs array
 * @prop    {Object}    data.coorObj object for storing coor xyz easier (than numjs)
 * @prop    {Number[]}  data.occupancy  occupancy
 * @prop    {Number[]}  data.beta    temp. factor
 * @prop    {String[]}  data.segname segment name
 * @prop    {String[]}  data.element element name
 * @prop    {String[]}  data.charge  charge
 *
 * @prop    {String[]}  data.moltype (UNDEFINED)
 * @prop    {Object}    data.conect    (UNDEFINED)
 * @prop    {String[]}  data.residue_flag (UNDEFINED)
 * @prop    {String[]}  data.original_resid  (UNDEFINED)
 * @prop    {String[]}  data.header  (UNDEFINED)
 */
var SasMol = {
  //initialize fields

  data :
    {

        atom:[] , //atom serial number
        index:[] ,
        original_index:[] ,
        name:[] , //atom name
        loc:[] ,  //altloc
        resname:[] , //resname
        chain:[] ,  //chain id
        resid:[] ,  //residue seq number 23-26
        rescode:[], //icode
        coor: [],//xyz
        coorObj:{},
        occupancy:[] ,  //occupancy
        beta:[] , //temp factor
        segname:[] ,  //segname
        element:[] ,  //elt symbol
        charge:[] , //charge
        //other
        moltype:[] ,
        conect : {},
        residue_flag : [] ,
        original_resid:[] ,
        header : []
    }


};

/**
 * atom setter
 * @param  {Number[]} atom  atom array to set
 */
SasMol.atom = function(atom){
  this.data.atom = atom;
}
/**
 * atom getter
 * @return {Number[]} atom array to get
 */
SasMol.getAtom = function(){
  return this.data.atom;
}
/**
 * index setter
 * @param  {Number[]} index index array to set
 */
SasMol.index = function(index){
  this.data.index = index;
}
/**
 * index getter
 * @return  {Number[]} index array to get
 */
SasMol.getIndex = function(){
  return this.data.index;
}
/**
 * origIndex setter
 * @param  {Number[]} index origIndex array to set
 */
SasMol.origIndex = function(index){
  this.data.original_index = index;
}
/**
 * origIndex getter
 * @return  {Number[]} origIndex array to get
 */
SasMol.getOrigIndex = function(){
  return this.data.original_index;
}
/**
 * name setter
 * @param  {String[]} name name array to set
 */
SasMol.name = function(name){
  this.data.name = name;
}
/**
 * name getter
 * @return  {String[]} name array to get
 */
SasMol.getName = function(){
  return this.data.name;
}
/**
 * loc setter
 * @param  {String[]} loc loc array to set
 */
SasMol.loc = function(loc){
  this.data.loc = loc;
}
/**
 * loc getter
 * @return  {String[]} loc array to set
 */
SasMol.getLoc = function(){
  return this.data.loc;
}
/**
 * resname setter
 * @param  {String[]} resname resname array to set
 */
SasMol.resname = function(resname){
  this.data.resname = resname;
}
/**
 * resname getter
 * @return  {String[]} resname array to get
 */
SasMol.getResname = function(){
  return this.data.resname;
}
/**
 * chain setter
 * @param  {String[]} chain chain id array to set
 */
SasMol.chain = function(chain){
  this.data.chain = chain;
}
/**
 * chain getter
 * @return  {String[]} chain id array to get
 */
SasMol.getChain = function(){
  return this.data.chain;
}
/**
 * resID setter
 * @param  {Number[]} id res id array to set
 */
SasMol.resID = function(id){
  this.data.resid = id;
}
/**
 * resID getter
 * @return  {Number[]} res id array to get
 */
SasMol.getResID = function(){
  return this.data.resid;
}
/**
 * rescode setter
 * @param  {String[]} rescode rescode array to set
 */
SasMol.rescode = function(rescode){
  this.data.rescode = rescode;
}
/**
 * rescode getter
 * @return  {String[]} rescode rescode array to get
 */
SasMol.getRescode = function(){
  return this.data.rescode;
}
/**
 * coor setter
 * @param  {Object} coor coor array to set
 */
SasMol.coor = function(coor){
  this.data.coor = coor;
}
/**
 * coor getter
 * @return  {Object} coor array to get
 */
SasMol.getCoor = function(){
  return this.data.coor;
}
/**
 * coorObj setter
 * @param  {Object} coorObj coorObj array to set
 */
SasMol.coorObj = function(coor){
  this.data.coorObj = coor;
}
/**
 * coorObj getter
 * @return  {Object} coorObj array to get
 */
SasMol.getCoorObj = function(){
  return this.data.coorObj;
}
/**
 * occupancy setter
 * @param  {Number[]} occupancy occupancy array to set
 */
SasMol.occupancy = function(occ){
  this.data.occupancy = occ;
}
/**
 * occupancy getter
 * @return  {Number[]} occupancy array to get
 */
SasMol.getOccupancy = function(){
  return this.data.occupancy;
}
/**
 * beta setter
 * @param  {Number[]} beta beta array to set
 */
SasMol.beta = function(beta){
  this.data.beta = beta;
}
/**
 * beta getter
 * @return  {Number[]} beta beta array to get
 */
SasMol.getBeta = function(){
  return this.data.beta;
}
/**
 * elt setter
 * @param  {String[]} elt elt array to set
 */
SasMol.elt = function(elt){
  this.data.element = elt;
}
/**
 * elt getter
 * @return  {String[]} elt array to get
 */
SasMol.getElt = function(){
  return this.data.element;
}
/**
 * charge setter
 * @param  {String[]} charge charge array to set
 */
SasMol.charge = function(charge){
  this.data.charge = charge;
}
/**
 * charge getter
 * @return  {String[]} charge array to get
 */
SasMol.getCharge = function(){
  return this.data.charge;
}
/**
 * segname setter
 * @param  {String[]} segname segname array to set
 */
//segname
SasMol.segname = function(segname){
  this.data.segname = segname;
}
/**
 * segname getter
 * @return  {String[]} segname array to get
 */
SasMol.getSegname = function(){
  return this.data.segname;
}

//SASMOL IO
/**
 * Reads PDB Asynchronously
 * @param   {string} inputStr    file
 *
 * @returns {string} full file as string
 */
SasMol.readPDB = function(inputStr){
  var linesArr = inputStr.split('\n').filter(Boolean);
  //console.log(linesArr);
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
 * writes PDB (not to file, but returns string)
 *
 * @returns {string} full file as string
 */
//return string instead of console logging
SasMol.writePDB = function(){
  var numAtoms = this.data.atom.length;
  var fileStr = "";
  //debugging
  //console.log("          1         2         3         4         5         6         7         \n");
  //console.log("01234567890123456789012345678901234567890123456789012345678901234567890123456789\n");
  for(var i = 0; i<numAtoms;i++){
    fileStr += vsprintf("%-6s%5s %-4s%1s%-4s%1s%4s%1s   %8s%8s%8s%6s%6s      %-4s%2s%2s\n", ["ATOM",this.getAtom()[i],this.getName()[0],this.getLoc()[0],this.getResname()[0],this.getChain()[0],this.getResID()[0],this.getRescode()[0],this.getCoorObj().x[0].toFixed(3),this.getCoorObj().y[0].toFixed(3),this.getCoorObj().z[0].toFixed(3),this.getOccupancy()[0].toFixed(2),this.getBeta()[0].toFixed(2),this.getSegname()[0],this.getElt()[0],this.getCharge()[0]]);

  }
  //console.log(fileStr);
  return fileStr;
}



module.exports =  {SasMol};
