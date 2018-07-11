$( function() {
  // $( "#dialog" ).dialog({ autoOpen: false });
  // $( "#opener" ).click(function() {
  //   $( "#dialog" ).dialog( "open" );
  // });

  $('.SSE')
  .draggable({
    handle: "h2",
    snap: true,
    containment: 'parent'
    // ,snap: '.ui-widget-header'
  });
  $('#build-canvas')
  .draggable({
    handle: "h2",
    snap: true,
    containment: 'parent'
    // ,snap: '.ui-widget-header'
  });

  //UNCOMMENT THESE TWO LINES TO PLAY AROUND WITH DIALOGS (position not inherently fixed - they are spawned on top)
  // $('.SSE').dialog();
  // $('#build-canvas').dialog();
});
