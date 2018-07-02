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
SasMol.index = function(name){
  this.data.name = name;
}
SasMol.getName = function(){
  return this.data.name;
}
module.exports =  {SasMol};
