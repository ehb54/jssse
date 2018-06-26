'use_strict';

var jssse = {};

jssse.createBoard = function( id, options ) {
    var bobj = { 
        id       : id
        ,columns : options ? ( options.columns ? options.columns : 2 ) : 2
        ,sobjs   : {}
        ,events  : []
        ,undo    : []
        ,undoPos : 0
        ,busy    : false
    };
    return bobj;
}

jssse.bobjInfo = function( bobj ) {
    console.log( "bobjInfo:" );
    console.log( "events length:" + bobj.events.length );
    console.log( "undo   length:" + bobj.undo  .length );
    console.log( "undoPos      :" + bobj.undoPos );
}

jssse.newEvent = function( bobj, eventObj ) {
    console.log( "newEvent called: " + JSON.stringify( eventObj ) );
    if ( !eventObj.type ) {
        console.error( "newEvents: no eventObj:type defined" );
        return;
    }
    bobj.events.push( eventObj );
    if ( eventObj.canUndo ) {
        // truncate away any possible redos on a new undo-able event
        bobj.undo.length = bobj.undoPos;
        bobj.undo.push( eventObj );
        bobj.undoPos++;
    }
    return jssse.processEvents( bobj );
}

jssse.processEvents = function( bobj ) {
    console.log( "processEvents called." );
    if ( 
        bobj.busy || !bobj.events.length
    ) {
        console.log( "processEvents: busy or no events to process" );
        return;
    }

    bobj.busy = true;

    var eventObj = bobj.events.shift();

    if ( !eventObj.type ) {
        console.error( "processEvents: Internal error: no eventObj:type defined." );
        bobj.busy = false;
        return jssse.processEvents( bobj );
    }

    if ( eventObj.undo ) {
        // undo-able events
        switch ( eventObj.type ) {

        case "select" : 
            console.log( "undo event type:select" );
            // undo processing for select
            break;

        case "remove" : 
            console.log( "event type:remove" );
            // undo processing for remove
            break;

        default :
            console.error( "processEvents: unsupported undo eventObj:type '" + eventObj.type + "'" );
            break;

        }
    } else {
        // do the event
        // undo-able events
        switch ( eventObj.type ) {

        case "select" : 
            console.log( "do event type:select" );
            // do processing for select
            break;

        case "remove" : 
            console.log( "event type:remove" );
            // do processing for remove
            break;

        default :
            console.error( "processEvents: unsupported do eventObj:type '" + eventObj.type + "'" );
            break;

        }
    }

    bobj.busy = false;
    if ( eventObj.cb ) {
        eventObj.cb( false, eventObj );
    }
    return jssse.processEvents( bobj );
}

jssse.undo = function( bobj, n, cb ) {
    n = n || 1;
    
    if ( n == -1 ) {
        n = bobj.undoPos;
    }

    if ( n > bobj.undoPos ) {
        return cb( new Error( "undo: length greater than available" ) );
    }

    // push undo events onto event stack

    for ( var i = 0; i < n; ++i ) {
        bobj.undoPos--;
        var eventObj = bobj.undo[ bobj.undoPos ];
        // don't store on undo/redo stack
        if ( eventObj.canUndo ) {
            delete eventObj.canUndo;
        }
        // remove any prior callback
        if ( eventObj.cb ) {
            delete eventObj.cb;
        }
        if ( cb && i == n - 1 ) {
            // only add callback to last eventObj
            eventObj.cb = cb;
        }
        jssse.newEvent( bobj, eventObj );
    }
}

jssse.redo = function( bobj, n, cb ) {
    n = n || 1;
    
    if ( n == -1 ) {
        n = bobj.undo.length;
    }

    if ( n > bobj.undo.length - bobj.undoPos ) {
        return cb( new Error( "redo: length greater than available" ) );
    }

    // push redo events onto event stack

    for ( var i = 0; i < n; ++i ) {
        var eventObj = bobj.undo[ bobj.undoPos ];
        bobj.undoPos++;
        // don't store on undo/redo stack
        if ( eventObj.canUndo ) {
            delete eventObj.canUndo;
        }
        // remove any prior callback
        if ( eventObj.cb ) {
            delete eventObj.cb;
        }
        if ( cb && i == n - 1 ) {
            // only add callback to last eventObj
            eventObj.cb = cb;
        }
        jssse.newEvent( bobj, eventObj );
    }
}

// -------- testing ----------


var bobj = jssse.createBoard( "id1" );
jssse.bobjInfo( bobj );

// test 1 event
jssse.newEvent( bobj, 
                {
                    sobj     : {}
                    ,type    : "select"
                    ,canUndo : true
                    ,info    : "first event"
                }
              );
                    
                        
jssse.bobjInfo( bobj );

jssse.undo( bobj, 1, ( err, eventObj ) => { console.log( "callback from undo: error: " + err + " eventObj:" + JSON.stringify( eventObj ) ); } );
jssse.bobjInfo( bobj );

jssse.undo( bobj, 1, ( err, eventObj ) => { console.log( "callback from undo: error: " + err + " eventObj:" + JSON.stringify( eventObj ) ); } );

jssse.bobjInfo( bobj );

// add 2 new events
jssse.newEvent( bobj, 
                {
                    sobj     : {}
                    ,type    : "select"
                    ,canUndo : true
                    ,info    : "try 2 first event"
                }
              );

jssse.bobjInfo( bobj );

jssse.newEvent( bobj, 
                {
                    sobj     : {}
                    ,type    : "select"
                    ,canUndo : true
                    ,info    : "try 2 second event"
                }
              );


jssse.bobjInfo( bobj );
jssse.undo( bobj, 2, ( err, eventObj ) => { console.log( "callback from undo: error: " + err + " eventObj:" + JSON.stringify( eventObj ) ); } );
jssse.bobjInfo( bobj );

// add 2 new events
jssse.newEvent( bobj, 
                {
                    sobj     : {}
                    ,type    : "select"
                    ,canUndo : true
                    ,info    : "try 3 first event"
                }
              );

jssse.bobjInfo( bobj );

jssse.newEvent( bobj, 
                {
                    sobj     : {}
                    ,type    : "select"
                    ,canUndo : true
                    ,info    : "try 3 second event"
                }
              );


jssse.bobjInfo( bobj );
jssse.undo( bobj, -1, ( err, eventObj ) => { console.log( "callback from undo: error: " + err + " eventObj:" + JSON.stringify( eventObj ) ); } );
jssse.bobjInfo( bobj );

// try redo

jssse.redo( bobj, 1, ( err, eventObj ) => { console.log( "callback from redo: error: " + err + " eventObj:" + JSON.stringify( eventObj ) ); } );
jssse.bobjInfo( bobj );
jssse.redo( bobj, 1, ( err, eventObj ) => { console.log( "callback from redo: error: " + err + " eventObj:" + JSON.stringify( eventObj ) ); } );
jssse.bobjInfo( bobj );
jssse.redo( bobj, 1, ( err, eventObj ) => { console.log( "callback from redo: error: " + err + " eventObj:" + JSON.stringify( eventObj ) ); } );

// now undo 2 beginning
jssse.undo( bobj, -1, ( err, eventObj ) => { console.log( "callback from undo: error: " + err + " eventObj:" + JSON.stringify( eventObj ) ); } );
jssse.bobjInfo( bobj );
// and redo 2 end
jssse.redo( bobj, -1, ( err, eventObj ) => { console.log( "callback from redo: error: " + err + " eventObj:" + JSON.stringify( eventObj ) ); } );
jssse.bobjInfo( bobj );

