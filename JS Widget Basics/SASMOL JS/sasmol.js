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

//getters and setters (using 'new' JS getters and setters?)
// Object.defineProperties(SasMol, {
//   'getAtom': {get: function() { return this.data.atom;}},
//   'atom': {set: function(atom) { this.data.atom = atom;}}
// });
//atom
SasMol.atom = function(atom){
  this.data.atom = atom;
}

SasMol.getAtom = function(){
  return this.data.atom;
}
//index
SasMol.index = function(index){
  this.data.index = index;
}
SasMol.getIndex = function(){
  return this.data.index;
}
//original_index
SasMol.origIndex = function(index){
  this.data.original_index = index;
}
SasMol.getOrigIndex = function(){
  return this.data.original_index;
}
//name
SasMol.name = function(name){
  this.data.name = name;
}
SasMol.getName = function(){
  return this.data.name;
}
//loc
SasMol.loc = function(loc){
  this.data.loc = loc;
}
SasMol.getLoc = function(){
  return this.data.loc;
}
//resname
SasMol.resname = function(resname){
  this.data.resname = resname;
}
SasMol.getResname = function(){
  return this.data.resname;
}
//chain
SasMol.chain = function(chain){
  this.data.chain = chain;
}
SasMol.getChain = function(){
  return this.data.chain;
}
//res seq
SasMol.resID = function(id){
  this.data.resid = id;
}
SasMol.getResID = function(){
  return this.data.resid;
}
//rescode
SasMol.rescode = function(rescode){
  this.data.rescode = rescode;
}
SasMol.getRescode = function(){
  return this.data.rescode;
}
//coor
SasMol.coor = function(coor){
  this.data.coor = coor;
}
SasMol.getCoor = function(){
  return this.data.coor;
}
SasMol.coorObj = function(coor){
  this.data.coorObj = coor;
}
SasMol.getCoorObj = function(){
  return this.data.coorObj;
}
//occupancy
SasMol.occupancy = function(occ){
  this.data.occupancy = occ;
}
SasMol.getOccupancy = function(){
  return this.data.occupancy;
}
//beta
SasMol.beta = function(beta){
  this.data.beta = beta;
}
SasMol.getBeta = function(){
  return this.data.beta;
}
//elt symbol
SasMol.elt = function(elt){
  this.data.element = elt;
}
SasMol.getElt = function(){
  return this.data.element;
}
//charge
SasMol.charge = function(charge){
  this.data.charge = charge;
}
SasMol.getCharge = function(){
  return this.data.charge;
}
//segname
SasMol.segname = function(segname){
  this.data.segname = segname;
}
SasMol.getSegname = function(){
  return this.data.segname;
}
module.exports =  {SasMol};
