
//bobj object defintion
var bobj = {
  id,
  columns,
  sobjs,
  events,
  undo,
  undoPos,
  busy
}

//sobj object definition
var sobj = {
  id,
  source,
  data,
  valid,
  bobj,
  options
}
//JSSSE object definition
var jssse = {

}
jssse.createBoard = function( id, options) {
  //default value
  options.columns = 2;
  enableLoad = false;
}
