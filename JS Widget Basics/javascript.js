
$( function() {
    // the widget definition, where "custom" is the namespace,
    // "jspdb" the widget name
    $.widget( "custom.jspdb", {
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
    $( "#my-widget1" ).jspdb().dialog();

    // Initialize with two customized options
    $( "#my-widget2" ).jspdb({
      red: 60,
      blue: 60
    })
    .dialog();

  } );
  var jspdb = {
    id: "asdf",
    options: {
      color: "red"
    },
    create: function(id, options){
      this.id = id;
      this.options = options;
      return this;
    }
  };

  var obj1 = jspdb.create("Sarah",{color:"blue"});


  var obj2 = jspdb.create("Robert",{color:"green"});
window.onload=function(){



  var div = document.getElementById("test1");
  //div.id=obj1.id;
  div.addEventListener("click", function(){
    console.log("id: "+div.id);
  });
  // div.id = obj1.id;
  // div.style.background = obj1.options.color;
  //
  // jspdb.create("Robert",{color:"green"});
  // var obj2 = jspdb;
  // var div2= document.createElement("div2");
  // div2.id = obj2.id;
  // div2.style.background = obj2.options.color;
}
