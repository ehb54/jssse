
$( function() {

  var seqDiv = document.getElementById('sequence0');
  var zoomBox = document.getElementsByClassName('sequenceZoomDiv')[0];


  //initialize span elements
  for(var i=1;i<80;i++){
    var newSpan = document.createElement('span');
    newSpan.className = 'res';
    var val = document.createTextNode(i);
    newSpan.appendChild(val);
    newSpan.id = 'res'+i;
    seqDiv.appendChild(newSpan);
    //console.log(newSpan);
  }

  var ds = new DragSelect({
  selectables: document.getElementsByClassName('res'),
  area: document.getElementById('sequence0'),
  callback: function(){
    //clear all elements first
    $(".res.zoom").remove();

    console.log(ds.getSelection());
    var selection = ds.getSelection();


    //sort selection by id
    //var reg = /res(\d)/g;
    var arr = [];
    for(var i = 0; i<selection.length;i++){

      var id = parseInt(selection[i].innerText);
      arr.push(id);
    }
    arr.sort(function (a, b) {  return a - b;  });

    //loop through selection and create zoomable rects
    for(var resIndex=0; resIndex<selection.length;resIndex++){
      var resZoom = document.createElement('span');
      resZoom.className = 'res zoom';
      var resZoomID = arr[resIndex];
      resZoom.innerText = arr[resIndex].toString();
      //resZoom.style.transform = 'scale(2)';
      resZoom.style.height = '30px';
      resZoom.style.width = '30px';
      resZoom.style.fontSize = '14px';
      resZoom.style.margin = '5px';
      resZoom.style.border = '1px solid black';
      resZoom.style.lineHeight = '30px';
      resZoom.style.top = '30%';
      zoomBox.appendChild(resZoom);

    }

    //check if div has any elements
    if (!zoomBox.hasChildNodes()){
      zoomBox.style.display = 'none';
    }
    else{
      zoomBox.style.display = 'inline-block';
    }
  },
  selector: document.getElementById('customSelector')

});
//modify ds-selector (css loads before)
//document.getElementsByClassName('ds-selector')[0].style.height = '75px';


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





}
