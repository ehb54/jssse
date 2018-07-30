//bring in SasMol (bundled with browserify)
var SasMol = require('./SASMOL\ JS/sasmol-bundle.js');
/**
 * bobj definition
 * @namespace
 * @property {string}   id        value passed to jssse.createBoard() and used as the parent DOM element for display
 * @property {number}   columns   number of sobjs to display per row
 * @property {sobj[]}   sobjs     collection of references of child sobjs
 * @property {event[]}  events    the array of pending events
 * @property {event[]}  undo      the array of events used for undo and redo
 * @property {number}   undoPos   position of current state in undo array
 * @property {boolean}  busy      set if events are processing
 */
var bobj = {
  id,
  columns,
  sobjs,
  events,
  undo,
  undoPos,
  busy
}

/**
 * sobj definition
 * @namespace
 * @property {string}   id        id value passed to jssse.createSobj() and used internally to keep track of the structure object
 * @property {string}   source    loaded source tag from last jssse.load()
 * @property {Object}   data      internal representation of structure data
 * @property {bool}     valid     set to true if the load is complete
 * @property {bobj}     bobj      references parent bobj
 * @property {Object}   options   current options
 */
var sobj = {
  id,
  source,
  data,
  valid,
  bobj,
  options
}
/**
 * JSSSE Object definition
 * @namespace
 */
var jssse = {
  //properties??

}
/**
 * creates a bobj object associated with the given DOM id
 * @func
 * @memberof jssse
 * @param {string}  id          DOM id
 * @param {Object}  options     an object with option properties
 * @prop  {number}  columns     number of sobjs to display per row
 * @prop  {boolean} enableLoad  determines whether or not a "load" button will be displayed to load a new structure directly into the board
 * @return {bobj}   the bobj which will hold all the state info for this board object
 */
jssse.createBoard = function( id, options) {
  //default values (detailed in API)
  options.columns = 2;
  enableLoad = false;

  //create bobj
  bobj = Object.create(bobj);
  bobj.id = id;
  bobj.options = options;

  return bobj;
}

/**
 * removes a bobj
 * @param  {bobj}     bobj      a bobj previously returned form bojb.createBoard
 */
jssse.remove = function( bobj ){
  //standard practice for 'removing'?
  bobj = {};
}
/**
 * undoes operations in the undo/redo stack
 * @param  {bobj}     bobj    the bobj to be operated on, returned previously from a jssse.createBoard() call
 * @param  {number}   n       optional number of steps to undo, 1 default, -1 undo to beginning
 * @param  {Function} cb      callback when operation is complete, returns err if undo count n is more than available
 */
jssse.undo = function( bobj, n, cb ){
  //UNDER DEVELOPMENT
}
/**
 * redoes operations in the undo/redo stack
 * @param  {bobj}     bobj    the bobj to be operated on, returned previously from a jssse.createBoard() call
 * @param  {number}   n       optional number of steps to redo, 1 default, -1 redo to beginning
 * @param  {Function} cb      callback when operation is complete, returns err if redo count n is more than available
 */
jssse.redo = function( bobj, n, cb ){

}
/**
 * internal function to add an event to event stack (stored in sobj, separate from undo/redo stack)
    called by every event (mouse click, text entry etc)
    pushes eventObj to the bobj event stack and the undo/redo stack of bobj (as identified in eventObj)
    calls jssse.processEvents( bobj )
 * @param  {bobj}        bobj     the bobj to be operated on, returned from a jssse.createBoard() call
 * @param  {event}       eventObj  object produced by event handler
 * @prop   {sobj}        sobj      the sobj for the event
 * @prop   {string}      type      the type of event: select, remove, edit ??
 * @prop   {boolean}     canUndo  set if this event causes a change which can be undone (optional)
 * @prop   {HTML_NODE[]} selected required types: select, remove ??
 * @prop   {boolean}     undo  set by jssse.undo() to specify events that are to be undone
 * @prop   {function}    cb      call back function when event is finished, called with ( err, eventObj )
 */
jssse.newEvent = function( bobj, eventObj ){
  // UNDER DEVELOPMENT

}
/**
 * internal function to process the event stack
    returns immediately if no unprocessed events present or if event processing flag is set
    marks object event processing flag
    process oldest event off event stack
    calls whatever is needed to handle the event, e.g. screen updates etc.
    when all callbacks complete, unmark object event processing flag, return jssse.processEvents( obj )
 * @param  {bobj}   bobj      the bobj to be operated on, returned from a jssse.createBoard() call
 */
jssse.processEvents = function( bobj ){
  // UNDER DEVELOPMENT
  //
}
/**
 * returns a complete object which can be saved with the complete state
 * @param  {bobj} bobj bobj : the bobj to be operated on
 * @return {bobj}      bdata : a deep copy of the bobj suitable for saving
 */
jssse.toBdata = function( bobj ){
  // UNDER DEVELOPMENT
}
/**
 * loads data previously serialized and creates a new bobj
 * @param  {string} id    DOM id to create bobj
 * @param  {bobj} bdata bdata : a deep copy of a bobj previously returned from jssse.toBdata()
 * @return {bobj}       bobj: the bobj
 */
jssse.loadBobj = function( id, bdata ){
  //UNDER DEVELOPMENT
}



/**
 *  d88b .d8888. .d8888. .d8888. d88888b   .88b  d88. d88888b d888888b db   db  .d88b.  d8888b. .d8888.
   `8P' 88'  YP 88'  YP 88'  YP 88'       88'YbdP`88 88'     `~~88~~' 88   88 .8P  Y8. 88  `8D 88'  YP
    88  `8bo.   `8bo.   `8bo.   88ooooo   88  88  88 88ooooo    88    88ooo88 88    88 88   88 `8bo.
    88    `Y8b.   `Y8b.   `Y8b. 88~~~~~   88  88  88 88~~~~~    88    88~~~88 88    88 88   88   `Y8b.
db. 88  db   8D db   8D db   8D 88.       88  88  88 88.        88    88   88 `8b  d8' 88  .8D db   8D
Y8888P  `8888Y' `8888Y' `8888Y' Y88888P   YP  YP  YP Y88888P    YP    YP   YP  `Y88P'  Y8888D' `8888Y'
 */

/**
 * creates a sobj object attached to the given bobj
 * @param  {bobj}     bobj      a bobj previously returned from bobj.createBoard
 * @param  {id}       id        a unique id for this sobj
 * @param  {Object}   options   an object with options as defined below
 * @prop   {boolean}  readonly  flag to determine whether or not the sobj is editable
 * @return {sobj}               the sobj which will hold all the state info for this structure object
 */
jssse.createSobj = function( bobj, id, options ){
  sobj = Object.create(sobj);
  sobj.id = id;
  sobj.options = options;
  //push to bobj?
  bobj.sobjs.push(sobj);
  return sobj;
}

/**
 * updates options in sobj - keep in mind merges, options altered by other windows, depth
 * @param  {sobj}     sobj      an sobj previously returned from a jssse.createSobj() call
 * @param  {Object}   options   an object with option properties as defined in jssse.createSobj() above
 * @param  {Function} cb      [description]
 */
jssse.update = function( sobj, options, cb ){

}
/**
 * return options of sobj, likely just return sobj.options;
 * @param  {sobj} sobj    an sobj previously returned from a jssse.createSobj() call
 * @return {Object}       options : the options object as defined in jssse.createSobj()
 */
jssse.options = function( sobj ){
  return sobj.options;
}
/**
 * loads the data into the object and displays
 * @param  {sobj}   sobj            an sobj previously returned from a jssse.createSobj() call
 * @param  {string}   data          a PDB in text, or a PDB file reference, e.g. "file://path/to/pdb" or "http://server/path/to/file" or "rcsb:1XYZ" etc.
 * @param  {Object}   loadOptions   an optional object describing loadOptions as described below
 * @prop   {string}   type          the type of data, such as pdb, pdbx, ...
 * @param  {Function} cb            callback function when load finishes or fails due to error
 * @return {string}                 throw error?
 */
jssse.load = function( sobj, data, loadOptions, cb){
  //CODE TO DO STUFF WITH LOADOPTIONS (not well-defined in API)



  //use regex's to detect if file:// or https://
  //local files can only be loaded through INPUT (vanilla JS) - SasMol does this
  var regex = /(.{4})/;
  if(regex.exec(data)[0] == 'http'){
    //retrieve file from pdb database
    $.get(data, function(info){
      //do something with info (assign to data property)
      sobj.data = info;
      //console.log(info);
    })
    .fail(function(err){
      console.log('error occured!');
    });
  }
  //else assume data is in PDB text (not an address)
  else{
    sobj.data = data;
  }
  //execute cb when load finishes
  cb;
}
/**
 * returns the data (possibly edited by the user) in various formats
 * @param  {sobj}   sobj          an sobj previously returned from a jssse.createSobj() call
 * @param  {Object} outOptions an optional object describing outOptions as described below
 * @prop   {string} type       the type of data, such as pdb, pdbx, ...
 * @return {Object}            the data of the object in the specified format
 */
jssse.out = function( sobj, outOptions ){
  var data = sobj.data;
  //LOGIC TO MODIFY DATA WITH OUTOPTIONS


  return data;
}
/**
 * returns new object after merging objects (variadic function). Be careful with options (??)
 * @param  {sobj} sobj1 variable number of sobjs previously returned from jssse.createSobj() calls
 * @param  {sobj} sobj2
 * @return {sobj}      new built sobj if successful, error if failure
 */
jssse.build = function( sobj1, sobj2 ){
  var sobj;
  //BUILD - what does it mean to build? combine arrays? what properties should be merged?


  return sobj;
}
/**
 * returns an array of objects copied (new instances created with properties copied over)
 * @param  {sobj} sobj an sobj to be copied, returned previously from a jssse.createSobj() call
 * @param  {number} n    number times to be copied
 * @return {sobj[]}      array of newly named (new id'd) sobjs also associated with the parent bobj
 */
jssse.copy = function( sobj, n ){
  //UNDER DEVELOPMENT
}

/**
 * MAIN
 */

//export to be used in other scripts (through browserify)
module.exports = {jssse, sobj};
