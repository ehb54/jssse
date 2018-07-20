//disable right-click on page
window.addEventListener('contextmenu', function (e) { // Not compatible with IE < 9
    e.preventDefault();
}, false);
//shorthand for $(document).ready(function(){ //CODE})
$( function() {
  $('#sequenceContainer').dialog({
    title: 'JSSSE WIDGET',
    height: 300,
    width:500
  });
  //JSSE OBJECT should provide # of residues, array of objects in such format
  var num = 9;
  /**
   * @example
   GLOBAL OBJECT Array definition
   format: [{res#: _uuid}, ...  ]
   res: [{ala1: '_8vmw96mko'}, {glu2: '_y6cdst2mm'}, ...]
   */
  var seqContainer = document.getElementById('sequenceContainer');
  var seqDiv = document.getElementById('sequenceDiv');
  //seqDiv.focus();
  var locatorDiv = document.getElementById('locatorDiv');
  var locatorBox = document.getElementById('locatorBox');
  //subtract pixels from border
  var seqDivWidth;
  var zoomDiv = document.getElementById('zoomDiv');
  var seqSelDiv = document.getElementById('selectDisplay');
  var seqSelRangeDiv = document.getElementById('selectDisplayRange');
  var seqSelDetDiv = document.getElementById('selectDisplayDetails');
  var arrObjGlobal = [];
  var zoomArr = [];
  //var arrObjGlobal = {};
  var type = 'res';
  var arrDisp = [];
  var aminoAcidArr = [
    'ala', 'arg', 'asn', 'asp', 'cys', 'gln', 'glu', 'gly', 'his','ile','leu','lys', 'met', 'phe', 'pro', 'ser', 'thr','trp', 'tyr', 'val'
  ];

  var eltWidth;
  var zoomPress = false;
/*
* Make modular/general w/ API - think about init. (*list* of vals (not necessarily res #'s))
*/
  function initialize(){
    //update calculation
    seqDivWidth = seqDiv.offsetWidth-4;
    //initialize span elements
    for(var i=1;i<num;i++){
      var newSpan = document.createElement('span');
      newSpan.className = 'res';
      newSpan.style.width = (seqDivWidth/num) + 'px';
      //assign text temporarily
      //var val = document.createTextNode(i);
      //newSpan.appendChild(val);
      newSpan.id = '_' + Math.random().toString(36).substr(2, 9);
      //newSpan.id = i;
      seqDiv.appendChild(newSpan);

      //assuming res id's unique, make keys ordered and sorted to make later arithmetic easier (parse obj for string instead of res)

      var key = aminoAcidArr[Math.floor(Math.random() * Math.floor(aminoAcidArr.length-1))]+i;
      //var key = 'res'+i;
      var obj = {};
      obj[key] = newSpan.id;
      arrObjGlobal.push(obj);
      //arrObjGlobal[key]=newSpan.id;
      //insert dividers
      var newDivider = document.createElement('div');
      newDivider.className = 'divider';

      if(num <= 20 && i<num){
        createDivider();
      }
      else if(i%10==0 && num <= 200 && i<num){
        createDivider();
      }
      else if(i%100==0 && num <=2000 && i<num){
        createDivider();
      }
      //nested function to create dividers
      function createDivider(){
        newDivider.style.left = (seqDivWidth/num)*i + 'px';
        newDivider.style.fontSize = '12px';
        var textNode = document.createTextNode(i+1);
        newDivider.appendChild(textNode);
        seqDiv.appendChild(newDivider);
      }
    }
    //update elt width after new calculations
      eltWidth = document.getElementsByClassName('res')[0].getBoundingClientRect().width;
  }
  initialize();

  // eltWidth = document.getElementsByClassName('res')[0].getBoundingClientRect().width;

//initiate ds variable
  var ds = new DragSelect({
  selectables: document.getElementsByClassName('res'),
  area: seqDiv,
  multiSelectKeys: ['ctrlKey'],
  onDragMove: function(e){
    var selection = ds.getSelection();
    //only do computations if there selection array isn't empty
    if(selection.length>0){
      var lastElt = selection[selection.length-1].id;

      var matchedKey = getKeyByValue(arrObjGlobal, lastElt);

      //console.log(matchedKey);
      updateCurrSelection(matchedKey, type, 'endIndex', 'update');
    }
  },
  onDragStart: function(e){
    var selection = ds.getSelection();
    //console.log(selection);
    //var firstElt = selection[0].id;
    //only do computations if there selection array isn't empty
    if(selection.length>0){
      var lastElt = selection[selection.length-1].id;
      //console.log(lastElt);
      var matchedKey = getKeyByValue(arrObjGlobal, lastElt);
      updateCurrSelection(matchedKey, type, 'startIndex', 'update');
    }


  },
  //onElementSelect: function(e){console.log(e);},
  callback: function(){
    //clear all elements first
    $('.res.zoom').remove();


    //console.log('liftoff!');
    var selection = ds.getSelection();

    if(selection.length==0){
      updateCurrSelection('','','startIndex',0);
      updateCurrSelection('','','endIndex',0);
    }
    calibrateDisp(selection, 0);
    updateSelDisplay();
    //console.log('sel array start: '+getKeyByValue(arrObjGlobal, selection[0].id));
    //console.log('sel array end: '+getKeyByValue(arrObjGlobal, selection[selection.length-1].id));
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
  selector: document.getElementById('customSelector'),
  onElementSelect: function(item){
    mirror(item,'select');
  },
  onElementUnselect: function(item){
    mirror(item,"unselect");
  }

});

//instantiate new dragselect within zoombox
var zoomds = new DragSelect({
  multiSelectKeys: ['ctrlKey'],
  area:zoomDiv,
  onDragMove: function(e){
    var selection = zoomds.getSelection();

    //only do computations if there selection array isn't empty
    if(selection.length>0){
      //SUBJECT TO CHANGE
      var regex = /(.{10})/;
      //equivID = regex.exec(item.id)[1];
      var lastElt = regex.exec(selection[selection.length-1].id)[1];

      var matchedKey = getKeyByValue(arrObjGlobal, lastElt);

      //console.log(matchedKey);
      updateCurrSelection(matchedKey, type, 'endIndex', 'update');
    }
  },
  onDragStart: function(e){
    var selection = zoomds.getSelection();
    //console.log(selection);
    //var firstElt = selection[0].id;
    //only do computations if there selection array isn't empty
    if(selection.length>0){
      var regex = /(.{10})/;
      var lastElt = regex.exec(selection[selection.length-1].id)[1];
      //console.log(lastElt);
      var matchedKey = getKeyByValue(arrObjGlobal, lastElt);
      updateCurrSelection(matchedKey, type, 'startIndex', 'update');
    }


  },
  onElementSelect: function(item){
    mirror(item,'select');
  },
  onElementUnselect: function(item){
    //console.log(item);
    mirror(item,"unselect");
  },
  callback: function(){
    //console.log('hi');
    //var selection = ds.getSelection();
    selection = zoomds.getSelection();
    if(selection.length==0){
      updateCurrSelection('','','startIndex',0);
      updateCurrSelection('','','endIndex',0);
    }
    //console.log(selection);
    calibrateDisp(selection, 1);
    updateSelDisplay();
  }
  //,selectables: document.getElementsByClassName('res')
});




//JQUERY STUFF
$('#sequenceContainer').on( 'dialogresizestop',
  function(event,ui){
    $('.res').remove();
    $('.divider').remove();
    //console.log('resized');

    arrObjGlobal = [];
    initialize();
    // ds.stop();
    // ds.start();
    ds.addSelectables(document.getElementsByClassName('res'));
    zoomds.start();
  }
);

// HELPER FUNCTIONS
//helper function for mirroring selection/unselection between primary sequence div and zoom div
function mirror(item,type){
  var zoomSel = zoomds.getSelection();
  var mainSel = ds.getSelection();

  //SUBJECT TO CHANGE (depends on ID)
  var regex = /(.{10})/;
  equivID = regex.exec(item.id)[1];


  if(type == "unselect"){
    //console.log('UNSELECTED');
    //console.log(item);
    ds.removeSelection(document.getElementById(equivID));
    if(document.getElementById('zoomDiv').childNodes.length > 2){
    // if(zoomds.getSelection().length !=0){
      zoomds.removeSelection(document.getElementById(equivID+'zoomed'));
    }
  }
  else if(type =="select"){
    ds.addSelection(document.getElementById(equivID));
    console.log(document.getElementById('zoomDiv').childNodes);
    if(document.getElementById('zoomDiv').childNodes.length > 2){
    // if(zoomds.getSelection().length !=0){

      zoomds.addSelection(document.getElementById(equivID+'zoomed'));
    }
  }
}
var arrDispArr = [];

var objArrKeyIndex =-1;
function arrUpdate(val, option){
  if(option == 'new'){
    objArrKeyIndex++;
    var objArrKey = 'arr'+objArrKeyIndex;
    var objArr = [];
    objArr.push(val);
    obj={};
    obj[objArrKey] = objArr;

    arrDisp.push(obj);
    //console.log(arrDisp);
    //objArrKeyIndex++;
  }
  else if(option == 'edit'){
    var objArrKey = 'arr'+objArrKeyIndex;
    arrDisp[objArrKeyIndex][objArrKey].push(val);
  }
  //console.log(arrDisp)
  //console.log(arrDisp[0]['arr'+objArrKeyIndex]);
  //console.log('length: '+arrDisp.length);
}
function updateCurrSelection(text, type, spanID, mode){

  //dynamically display current selection:
  var str = '';
  if (mode=='update'){
      //console.log(text);
     str = parseKey(text, type).toString();

  }
  document.getElementById(spanID).innerText = str;
}

function updateSelDisplay(){
  //add display for SELECTION
  var len=arrDisp.length;
  //clear children first
  while (seqSelRangeDiv.firstChild) {
    seqSelRangeDiv.removeChild(seqSelRangeDiv.firstChild);
  }
  while (seqSelDetDiv.firstChild) {
    seqSelDetDiv.removeChild(seqSelDetDiv.firstChild);
  }
  if(len>0){

    for(var i=0;i<len;i++){
      //initialize 'from' text
      var selspan = document.createElement('span');
      var selInfospan = document.createElement('span');
      //startCount.style.margin = '0px 2px';
      var subarray = arrDisp[i]['arr'+i];
      var text = (subarray[0]).toString();

      //if subarray has more than one element, initialize colon part and 'to' part
      if(subarray.length>1){

        //additional part (intermediate and end)
        var mid = ' - ';
        var toText = (subarray[subarray.length-1]).toString();
        text+=mid;
        text+=toText;

      }
      var textNode = document.createTextNode(text);
      selspan.appendChild(textNode);
      selspan.classList.add('subarray');

      seqSelRangeDiv.appendChild(selspan);

      //seqSelDetDiv
      //get res name
      //console.log(subarray[0]);

      var detailsDisp = [];
      for(var j = 0;j<subarray.length;j++){
        for (key in arrObjGlobal[subarray[j]-1]){
          var reg = new RegExp('(\\w{3})\\d+', 'g');
          var res = reg.exec(key)[1];
          detailsDisp.push(res);
        }
        //console.log(arrObjGlobal[subarray[j]]);
      }
      text = JSON.stringify(detailsDisp);
      //console.log(text);
      textNode = document.createTextNode(text);
      selInfospan.appendChild(textNode);
      selInfospan.classList.add('subarray');

      //seqSelDetDiv.appendChild(selInfospan);
    }
  }
}
//helper method for clearing selection (making selection array zero, removing DOM children elements)
function clearAllSelection(){
  ds.clearSelection();
  arrDisp.length=0;
  updateSelDisplay();
  updateCurrSelection('','','startIndex',0);
  updateCurrSelection('','','endIndex',0);
}
//split selection array into consecutive subarrays; called when selection is made
function calibrateDisp(sel, widgetIndex){
  objArrKeyIndex = -1;
  //reset array
  arrDisp=[];

  var arrSorted = [];
  var len=sel.length;
  var currKey;
  var prevKey;

  //1. sort Array
  for(var i=0; i<len;i++){

    var reg = /(.{10})/;
    //console.log(reg.exec(sel[i].id)[1]);
    currKey = parseKey(getKeyByValue(arrObjGlobal, reg.exec(sel[i].id)[1]), type);
    arrSorted.push(currKey);
  }
  arrSorted.sort(function (a, b) {  return a - b;  });
  //2. update array
  for(var i=0; i<len;i++){

    if(i==0){
      currKey = arrSorted[0];
      prevKey = currKey;
      arrUpdate(currKey,'new');
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
        arrUpdate(currKey,'edit');
      }
      else{
        arrUpdate(currKey,'new');
      }
    }


  }
  arrDispArr[widgetIndex] = arrDisp;
  //console.log(arrDispArr);
}
function parseKey(text, type){
  //instead of type, use general 3 letters for residue name?
  var reg;
  if(type=='res'){
    reg = new RegExp('\\w{3}(\\d+)', 'g');
  }

  //console.log(text);
  var res = parseInt(reg.exec(text)[1]);
  //console.log(res);
  return res;

}
function getKeyByValue(arr, value) {
  for(var i=0, iLen = arr.length; i<iLen;i++){
    for (key in arr[i]){
      //var key = type+ (i+1);
      if(arr[i][key] == value){return key;}
    }

  }
  //return Object.keys(arr).find(key => arr[key] === value);
}
function getDeepKeys(obj) {
    var keys = [];
    for(var key in obj) {
        keys.push(key);
        if(typeof obj[key] === 'object') {
            var subkeys = getDeepKeys(obj[key]);
            keys = keys.concat(subkeys.map(function(subkey) {
                return key + '.' + subkey;
            }));
        }
    }
    return keys;
}
//console.log(getDeepKeys(arrObjGlobal));
//console.log(arrObjGlobal.find());
//add clear selection functionality
var btn = document.getElementById('clearSelection');
btn.addEventListener('click',function(e){
  clearAllSelection();
});
var barMarker = document.getElementById('marker');
//add marker to follow mouse in div
seqDiv.addEventListener('mousemove', function(e){
  seqDivFlag = true;
  var seqDivPosition = getPosition(seqDiv);
  //console.log('mousein '+ (e.pageX - seqDivPosition.x));
  barMarker.style.display = 'block';
  barMarker.style.left = (e.pageX - seqDivPosition.x)+'px';
  locatorBox.style.display = 'inline-block';
  displayLocator(getIndexByWidth(e.pageX - seqDivPosition.x));

});
var seqDivFlag = false;
seqDiv.addEventListener('mouseleave',function(e){
  seqDivFlag = false;
  //console.log('mouseout '+e.clientX);
  barMarker.style.display = 'none';
  locatorDiv.style.display = 'none';
});
//listen to right-click
seqDiv.addEventListener('contextmenu',function(e){
  //clearAllSelection();
  seqDiv.focus();
});

//make keypress event general (only open if there exists a value to be zoomed in on)
document.addEventListener('keydown',function(e){
  if(e.shiftKey && seqDivFlag){
    zoomPress = true;
    //console.log('we here');
    zoomDiv.style.display = 'block';
    if(parseInt(locatorBox.innerText) < arrObjGlobal.length){

      var info = Object.keys(arrObjGlobal[parseInt(locatorBox.innerText)])[0];
      populateZoomDiv(info);
    }
    //console.log(info);

    //console.log(resname + ' ' + resid);

  }


});
//can't just listen to keyup
document.addEventListener('keyup',function(e){
  if(zoomPress){
    //console.log(zoomArr);
    //remove 'zoomed' class from primary seq
    for(var i = 0; i < zoomArr.length; i++){
      //document.getElementById(zoomArr[i]).classList.remove('zoomed-middle');
      document.getElementById(zoomArr[i]).classList.remove('zoomed-lefthook');
      document.getElementById(zoomArr[i]).classList.remove('zoomed-righthook');
    }
    zoomArr = [];
    //console.log('we out');
    zoomDiv.style.display = 'none';
    zoomPress = false;
  }

});
  function displayLocator(loc){
    locatorDiv.style.display='block';
    locatorBox.innerText=loc;
  }
  function getIndexByWidth(x){
    return Math.ceil(x/eltWidth);
  }
  function populateZoomDiv(val){
    //clear children except selector box
    while(zoomDiv.children.length>1){
      zoomDiv.removeChild(zoomDiv.lastChild);
    }
    var zoomRangeLeft;
    var zoomRangeWidth;
    //SUBJECT TO CHANGE
    console.log(val);
    var reg = /(\w{3})(\d+)/;
    var resname = reg.exec(val)[1];
    var resid = parseInt(reg.exec(val)[2]);

    // MAKE MODULAR
    var lorange = resid - 6;
    if(resid <= 5){
      lorange = 0;
    }
    var hirange = resid + 5;
    if(hirange > arrObjGlobal.length){
      hirange = arrObjGlobal.length;
    }
    for(var i = lorange; i<hirange;i++){
      var resZoom = document.createElement('span');
      resZoom.className = 'res';
      var info  = Object.keys(arrObjGlobal[i])[0];
      resname = reg.exec(info)[1];
      resid = parseInt(reg.exec(info)[2]);
      resZoom.innerText = resname + '\n' + resid;
      var id = Object.values(arrObjGlobal[i])[0];
      resZoom.id = id+'zoomed';
      resZoom.style.height = '30px';
      resZoom.style.width = '30px';
      resZoom.style.fontSize = '14px';
      resZoom.style.margin = '5px';
      resZoom.style.border = '1px solid black';
      // resZoom.style.lineHeight = '30px';
      //resZoom.style.top = '30%';
      zoomDiv.appendChild(resZoom);
      zoomds.addSelectables(resZoom);

      //mirror because spawning these new spans are called after selection in primary seq div
      var mirrorItem = document.getElementById(id);
      // console.log(id);
      if(mirrorItem.className.includes('ds-selected')){
        mirror(mirrorItem,"select");
      }
      if(i==lorange){
        mirrorItem.classList.add('zoomed-lefthook');
        zoomRangeLeft = mirrorItem.offsetLeft;
        // console.log(mirrorItem);
        // console.log(zoomRangeLeft);
      }
      else if(i==hirange-1){
        mirrorItem.classList.add('zoomed-righthook');
      }
      else{
        //mirrorItem.classList.add('zoomed-middle');
      }
      //add to zoom arr
       zoomArr.push(id);
      //zoomArr[i] = id;

    }
    // //create visual range in primary seq div
    // var zoomRange = document.createElement('div');
    // zoomRange.classList.add('res');
    // zoomRange.style.display = 'inline-block';
    // zoomRange.style.zIndex = '-1';
    // zoomRange.style.float = 'left';
    // zoomRange.position = 'absolute';
    // zoomRange.offsetLeft = zoomRangeLeft;
    // zoomRange.style.width = zoomRangeLeft + (hirange - lorange)*eltWidth+'px';
    // console.log(zoomRange.style.width);
    // zoomRange.style.outline = '2px solid red';
    //
    // seqDiv.appendChild(zoomRange);
    // console.log(zoomRange);
  }

/**
  *Helper function to get an element's exact position (if nested in container divs)
 * CREDIT: https://www.kirupa.com/html5/get_element_position_using_javascript.htm
 */

function getPosition(el) {
  var xPos = 0;
  var yPos = 0;

  while (el) {
    if (el.tagName == "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;

      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }

    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos
  };
}


  //ds.addSelection(document.getElementById(arrObjGlobal[3][1].id))

} );//end of jQuery.ready()
