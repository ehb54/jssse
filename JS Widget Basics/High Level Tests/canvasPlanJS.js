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

  // $('.SSE').dialog();
  // $('#build-canvas').dialog();
});
