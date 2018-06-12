
$( function() {
    // the widget definition, where "custom" is the namespace,
    // "colorize" the widget name
    $.widget( "custom.colorize", {
      // default options
      options: {
        red: 255,
        green: 0,
        blue: 0,

        // Callbacks
        change: null,
        random: null
      },

      // The constructor
      _create: function() {
        this.element
          // add a class for theming
          .addClass( "custom-colorize" )
          .css( "background-color", "rgb(" +
            this.options.red +"," +
            this.options.green + "," +
            this.options.blue + ")"
          );
          //handle events
        this._on(this.element, {
          click: "_message"
        });
      },

    //private method
    _message: function(event){
      //this refers to widget instance
      console.log("element id: "+this.element[0].id+"\n");
    }
});


    // Initialize with default options
    $( "#my-widget1" ).colorize().dialog();

    // Initialize with two customized options
    $( "#my-widget2" ).colorize({
      red: 60,
      blue: 60
    })
    .dialog();

  } );
