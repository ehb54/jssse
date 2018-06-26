//shorthand for $(document).ready(function(){ //CODE})
$( function() {
  var seqDiv = document.getElementById('sequence0');
  var zoomBox = document.getElementsByClassName('sequenceZoomDiv')[0];
  var seqSelDiv = document.getElementById('selectDisplay');
  var arrObjGlobal = [];
  var type = "res";
  var arrDisp = [];
/*
* Make modular/general w/ API - think about init. (*list* of vals (not necessarily res #'s))
*/
  //initialize span elements
  for(var i=1;i<1000;i++){
    var newSpan = document.createElement('span');
    newSpan.className = 'bob';
    //assign text temporarily
    //var val = document.createTextNode(i);
    //newSpan.appendChild(val);
    //newSpan.id = '_' + Math.random().toString(36).substr(2, 9);
    newSpan.id = i;
    seqDiv.appendChild(newSpan);

    //assuming res id's unique, make keys ordered and sorted to make later arithmetic easier (parse obj for string instead of res)
    var key = 'res'+i;
    var obj = {};
    obj[key] = newSpan.id;
    arrObjGlobal.push(obj);
    //console.log(newSpan);
  }
  //console.log(arrObjGlobal[0]);

//initiate ds variable
  var ds = new DragSelect({
  selectables: document.getElementsByClassName('bob'),
  area: document.getElementById('sequence0'),
  onDragMove: function(e){
    var selection = ds.getSelection();

    //only do computations if there selection array isn't empty
    if(selection.length>0){
      var lastElt = selection[selection.length-1].id;

      var matchedKey = getKeyByValue(arrObjGlobal, lastElt);

      //console.log(matchedKey);
      updateCurrSelection(matchedKey, type, 'endIndex');
    }
    //arrUpdate(selection);
    //console.log(lastElt);
  },
  onDragStart: function(e){
    //console.log('SPLIT HERE');
    var selection = ds.getSelection();
    //console.log(selection);
    //var firstElt = selection[0].id;
    //only do computations if there selection array isn't empty
    if(selection.length>0){
      var lastElt = selection[selection.length-1].id;

      var matchedKey = getKeyByValue(arrObjGlobal, lastElt);

      console.log(matchedKey);
      updateCurrSelection(matchedKey, type, 'startIndex');
    }


  },
  //onElementSelect: function(e){console.log(e);},
  callback: function(){
    //clear all elements first
    $(".res.zoom").remove();

    //console.log('liftoff!');
    var selection = ds.getSelection();

    calibrateDisp(selection);
    updateSelDisplay();
    //loop through selection and create zoomable rects
    for(var resIndex=0; resIndex<selection.length;resIndex++){
      var resZoom = document.createElement('span');
      resZoom.className = 'res zoom';
      //var resZoomID = arr[resIndex];
      //resZoom.innerText = arr[resIndex];
      //resZoom.style.transform = 'scale(2)';
      resZoom.style.height = '30px';
      resZoom.style.width = '30px';
      resZoom.style.fontSize = '14px';
      resZoom.style.margin = '5px';
      resZoom.style.border = '1px solid black';
      resZoom.style.lineHeight = '30px';
      resZoom.style.top = '30%';
      //zoomBox.appendChild(resZoom);

    }
/*
    //check if div has any elements
    if (!zoomBox.hasChildNodes()){
      zoomBox.style.display = 'none';
    }
    else{
      zoomBox.style.display = 'inline-block';
    }*/
  },
  selector: document.getElementById('customSelector')

});

var objArrKeyIndex =-1;
function arrUpdate(val, option){
  if(option == 'new'){
    objArrKeyIndex++;
    var objArrKey = "arr"+objArrKeyIndex;
    var objArr = [];
    objArr.push(val);
    obj={};
    obj[objArrKey] = objArr;

    arrDisp.push(obj);
    //console.log(arrDisp);
    //objArrKeyIndex++;
  }
  else if(option == 'edit'){
    var objArrKey = "arr"+objArrKeyIndex;
    arrDisp[objArrKeyIndex][objArrKey].push(val);
  }
//console.log(arrDisp)
  //console.log(arrDisp[0]['arr'+objArrKeyIndex]);
  //console.log('length: '+arrDisp.length);
}
function updateCurrSelection(text, type, spanID){

  //dynamically display current selection:
  var str = parseKey(text, type).toString();
  document.getElementById(spanID).innerText = str;
}

function updateSelDisplay(){
  //add display for SELECTION
  var len=arrDisp.length;

  if(len>0){
    //clear children first
    while (seqSelDiv.firstChild) {
      seqSelDiv.removeChild(seqSelDiv.firstChild);
    }
    for(var i=0;i<len;i++){
      //initialize 'from' text
      var selspan = document.createElement('span');
      //startCount.style.margin = "0px 2px";
      var subarray = arrDisp[i]['arr'+i];
      var text = (subarray[0]).toString();

      //if subarray has more than one element, initialize colon part and 'to' part
      if(subarray.length>1){

        //INTERMEDIATE PART (colon)
        var mid = ' : ';
        var toText = (subarray[subarray.length-1]).toString();
        text+=mid;
        text+=toText;

      }
      var textNode = document.createTextNode(text);
      selspan.appendChild(textNode);
      selspan.classList.add('subarray');

      seqSelDiv.appendChild(selspan);
    }
  }
}
//split selection array into consecutive subarrays; called when selection is made
function calibrateDisp(sel){
  objArrKeyIndex = -1;
  //reset array
  arrDisp=[];

  var arrSorted = [];
  var len=sel.length;
  var currKey;
  var prevKey;

  //1. sort Array
  for(var i=0; i<len;i++){
    currKey = parseKey(getKeyByValue(arrObjGlobal, sel[i].id), type);
    arrSorted.push(currKey);
  }
  arrSorted.sort(function (a, b) {  return a - b;  });
  //2. update array
  for(var i=0; i<len;i++){

    if(i==0){
      currKey = arrSorted[0];
      prevKey = currKey;
      arrUpdate(currKey,"new");
      // console.log('currKey: '+currKey);
      // console.log('prevkey: '+prevKey);
    }
    else{
      currKey = arrSorted[i];
      prevKey = arrSorted[i-1];
      // console.log('currKey: '+currKey);
      // console.log('prevkey: '+prevKey);
      //check if contiguous
      if(prevKey == (currKey-1)){
        arrUpdate(currKey,"edit");
      }
      else{
        arrUpdate(currKey,"new");
      }
    }


  }
}
function parseKey(text, type){
  var reg = new RegExp(type+'(\\d+)', "g");
  //console.log(text);
  var res = parseInt(reg.exec(text)[1]);
  //console.log(res);
  return res;

}
function getKeyByValue(arr, value) {
  for(var i=0, iLen = arr.length; i<iLen;i++){
    var key = 'res'+ (i+1);
    if(arr[i][key] == value){return key;}
  }
}
console.log('END OF JQUERY SELECTOR');
} );//end

//JSPDB object definition
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
  console.log('Beginning of WINDOW ONLOAD');
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
