
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
    create: function(id, options){
      var newObj={};
      newObj.id = id;
      newObj.options = options;
      return newObj;
    },
    listen: function(elt_id){
      var wid = document.getElementById(elt_id);
      wid.addEventListener("click", function(){
        console.log("element id: "+elt_id);
      });
    }
  };
//create objects (debugging purposes - can view obj1, obj2 properties in console)
  var obj1 = jspdb.create("Sarah",{color:"blue"});
  var obj2 = jspdb.create("Robert",{color:"green"});

/*  make sure DOM is properly loaded before manipulating (changing div into
 *  dialog, adding eventlisteners)
*/
window.onload=function(){
  //make div a jQuery UI dialog Box
  $("#test1").dialog().css("background-color","blue");
  $("#div2").dialog().css("background-color", "red");
  //add event listeners
  jspdb.listen("test1");
  jspdb.listen("div2");
}
