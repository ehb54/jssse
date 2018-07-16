define(function(){
  var atom = [1, 2];
  function getAtom(){
    return this.atom;
  }
  function setAtom(atom){
    this.atom = atom;
  }
  return {
    atom : atom,
    getAtom: getAtom,
    setAtom: setAtom
  };
});
