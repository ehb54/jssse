
$( function() {
//     the widget definition, where "custom" is the namespace,
//     "jspdb" the widget name
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

      //initialize variables
      var highlightBox_x1=0;
      var highlightBox_x2=0;
      var multipleSelect = false;
      var sequenceDiv = document.getElementById('sequence0');
      var barMarker = document.getElementById('marker');
      var selectHighlight = document.getElementById('selectLocator');
      var selectSequence = document.getElementById('main-selector');
      //console.log(barMarker);
      sequenceDiv.addEventListener('mousemove', function(e){
        //console.log('mousein '+e.clientX);
        barMarker.style.display = 'block';
        barMarker.style.left = (e.pageX-10)+'px';
        highlightBox_x2 = barMarker.style.left;
        //console.log(highlightBox_x2);
        drawHighlightBox();

      });
      sequenceDiv.addEventListener('mouseleave',function(e){
        //console.log('mouseout '+e.clientX);
        barMarker.style.display = 'none';
      });
      sequenceDiv.addEventListener('mousedown', function(evt){
        //ensure left mouse button clicked
        if(evt.which==1){
          selectHighlight.style.display = 'inline';
          highlightBox_x1 = barMarker.style.left;
          //console.log(highlightBox_x1);
          drawHighlightBox();
        }
      });
      sequenceDiv.addEventListener('mouseup', function(evt){
        console.log('clicked!');
      });
      sequenceDiv.addEventListener('mouseup', function(evt){
        //ensure left mouse button clicked
        if(evt.which == 1){
          selectHighlight.style.display = 'none';
          highlightBox_x2 = barMarker.style.left;
          var res = drawHighlightBox();
          //console.log(res);
          multipleSelect=false;
          if(evt.ctrlKey){
            multipleSelect=true;
            console.log('ctrl+clickup');
          }
          //draw selection box
          drawSelector(res);
          //
        }

      });

      function drawHighlightBox(){
        //console.log(highlightBox_x1);
        selectHighlight.style.left = highlightBox_x1;
        var res={};
        selectHighlight.style.width = parseInt( highlightBox_x2, 10 ) - parseInt( highlightBox_x1, 10 ) + "px";
        res = {
          left: selectHighlight.style.left,
          width: selectHighlight.style.width
        };

        return res;
        //console.log(selectHighlight.style.width);
      }
      function drawSelector(res){

        var id = 0;
        var newDiv = document.createElement('div');
        var newDivChild = document.createElement('div');
        var newDivChildLR = document.createElement('div');
        var newDivChildRR = document.createElement('div');

        newDiv.style.left = res.left;
        newDiv.style.width = res.width;
        newDiv.className = "locatorDiv";
        newDiv.id = 'locator-element'+id;
        newDiv.style.display = "block";

        newDivChild.className = "locator_rect";
        newDivChildLR.className = "left resizer";
        newDivChildRR.className = "right resizer";

        newDivChild.style.display = "block";
        newDivChildLR.style.display = "block";
        newDivChildRR.style.display = "block";


        newDiv.addEventListener('mouseenter', function(e){
          //console.log('on!');
          //newDiv.style.pointerEvents='none';
          //sequenceDiv.classList.toggle('disabled');
          //newDiv.classList.remove('disabled');
          //newDiv.style.pointerEvents='auto';

        });
        newDiv.addEventListener('mouseleave', function(e){
          //newDiv.style.pointerEvents='auto';
          //console.log('out!!');
          //sequenceDiv.classList.toggle('disabled');
        });
        if(multipleSelect){

          newDiv.appendChild(newDivChild);
          newDiv.appendChild(newDivChildLR);
          newDiv.appendChild(newDivChildRR);
          document.getElementById('sequence0').appendChild(newDiv);
        }
        else{
          //clear all select rectangles if ctrl+click is not clicked
          $('.locatorDiv').remove();

          //and then create element
          newDiv.appendChild(newDivChild);
          newDiv.appendChild(newDivChildLR);
          newDiv.appendChild(newDivChildRR);
          document.getElementById('sequence0').appendChild(newDiv);
        }
        // var locatorDiv = document.getElementById('locator element '+id);
        // locatorDiv
        // locatorDiv.addEventListener('mousemove', function(e){
        //   console.log('on newDiv!' + e.clientX);
        //   //locatorDiv.style.pointerEvents='none';
        //
        // });

      }

      document.body.addEventListener('contextmenu', function(ev) {
          ev.preventDefault();
          //alert('Right Click Performed!');
          $('.locatorDiv').remove();
          //$('.highlightBox').remove();
          return false;
      }, false);

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
    },
    load: function(obj, data, cb){
      //1. Parse/match file reference
      var type = /^([a-zA-z]){4,5}:\/\//;
      var res = type.exec(data);
      //console.log(res);
      //assume local data?
      if(res==null){
        obj.data = data;
        console.log(obj);
      }
      //check address type (file vs https)
      else if(res[0]==="https://"){
        //retrieve file from pdb database
        $.get(data, function(info){
          //do something with info (assign to data property)
          obj.data = info;
          //console.log(info);
        })
        .fail(function(err){
          console.log("error occured!");
      });
    }
  },
  out: function(obj,options){
    if(options.format==='pdb'){
      //call fn/script to parse obj.data to pdb
    }
    //handle other formats
  },
  update: function(obj, options, cb){
    //update options properties
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

    //logging objects
      // console.log("obj1: " + JSON.stringify(obj1));
      // console.dir(obj1);
      // console.dir(obj2);

  //add event listeners
  jspdb.listen(obj1);
  jspdb.listen(obj2);

  //handling local files
  function handleFileSelect(e) {
    var files = e.target.files; // FileList object (list of File objects)
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function (evt){
      //grabs info
      var info = evt.target.result;
      //create jspdb object
      var obj3 = jspdb.create('fakediv',{});
      console.log(info);
      jspdb.load(obj3, info, function(err){if(err){throw err;}});
    }
    reader.readAsText(file);


  }
  //add event listener for when the user selects a file
  //document.getElementById('files').addEventListener('change', handleFileSelect, false);
  //do something with data

  //other stuff
  jspdb.load(obj1, "https://files.rcsb.org/view/5W4C.pdb", function(err){
    if(err){throw err;}
    console.log("success");
  });


  var seqDiv = document.getElementById('sequence0');


  //initialize span elements
  for(var i=1;i<30;i++){
    var newSpan = document.createElement('span');
    newSpan.className = 'res';
    var val = document.createTextNode(i);
    newSpan.appendChild(val);
    newSpan.id = 'res'+i;
    seqDiv.appendChild(newSpan);
    //console.log(newSpan);
  }


}
