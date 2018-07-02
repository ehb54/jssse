var SasMol = {
  //initialize fields

  data :
    {
        atom:[] ,
        index:[] ,
        original_index:[] ,
        name:[] ,
        loc:[] ,
        resname:[] ,
        chain:[] ,
        resid:[] ,
        rescode:[],
        coor:
        occupancy:[] ,
        beta:[] ,
        segname:[] ,
        element:[] ,
        charge:[] ,
        moltype:[] ,
        conect : {},
        residue_flag : [] ,
        original_resid:[] ,
        header : []
    }


};

//getters and setters (using 'new' JS getters and setters?)
Object.defineProperties(SasMol, {
  'getAtom': {get: function() { return this.data.atom;}},
  'atom': {set: function() { this.data.atom = atom;}}
});
//atom
SasMol.atom(atom){
  this.data.atom = atom;
}

SasMol.getAtom(){
  return this.data.atom;
}
//index
SasMol.index(index){
  this.data.index = index;
}
SasMol.getIndex(){
  return this.data.index;
}
//original_index
SasMol.index(index){
  this.data.original_index = index;
}
SasMol.getOrigIndex(){
  return this.data.original_index;
}
//name
SasMol.index(name){
  this.data.name = name;
}
SasMol.getName(){
  return this.data.name;
}
