
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
    //take in object as parameter
    listen: function(obj){
      if(typeof(obj)==="object"){
        var wid;
        if(obj.id != null && (wid = document.getElementById(obj.id))){
          wid.addEventListener("click", function(){
            console.log("element id: "+obj.id);
          });
        }
      }
    }
  };


/*  make sure DOM is properly loaded before manipulating (changing div into
 *  dialog, adding eventlisteners)
*/
window.onload=function(){
  //make div a jQuery UI dialog Box (maybe in jspdb object definition?)
  $("#test1").dialog().css("background-color","blue");
  $("#div2").dialog().css("background-color", "red");

  //create objects (debugging purposes - can view obj1, obj2 properties in console)
    var obj1 = jspdb.create("test1",{readonly:"true"});
    var obj2 = jspdb.create("div2",{fileformat:"pdb"});

      console.log("obj1: " + JSON.stringify(obj1));
      console.dir(obj1);
      console.dir(obj2);

  //add event listeners
  jspdb.listen(obj1);
  jspdb.listen(obj2);
}
