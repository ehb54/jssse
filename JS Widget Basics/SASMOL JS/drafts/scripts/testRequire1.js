define(['scripts/objects.js'], function(objects){
  function readPDB(toObj){
    var newAtom = ['blah'];
    objects.setAtom(newAtom);
    //console.log(objects.getAtom());
  }
  return {
    readPDB: readPDB
  }
})
