//bring in definitions (SASMOL and JSSSE)
var SasMol = require('../SASMOL\ JS/sasmol.js');
//disable right-click on page
window.addEventListener('contextmenu', function (e) { // Not compatible with IE < 9
    e.preventDefault();
}, false);
//shorthand for $(document).ready(function(){ //CODE})
$( function() {

  /**************************************************************************
    SASMOL/JSSSE CODE
    *************************************************************************/

    //global info file (for readPDB to access)
    var info;
    var firstRead = true;
    var readBool = false;
    var numPDB = 0;
    var loadBool = false;
    //handling local files
    function handleFileSelect(e) {
      numPDB++;
      var files = e.target.files; // FileList object (list of File objects)
      var file = files[0];
      var reader = new FileReader();
      //display info to HTML
      var output = [];
      reader.onload = function (evt){


        //display file INFORMATION
        for (var i = 0, f; f = files[i]; i++) {
          //store read information inside jssse objects
          //grabs info
          info = evt.target.result;
          jssse.readPDB(info);
          readBool = true;
          num = jssse.getAtom().length;
          //only initialize if there is valid PDB to be read
          if(firstRead && num != 0){
            populateWindows('sobj1');
            initialize('start', jssse,0);
          }
          else{
            initialize('reload',jssse,0);
          }
          firstRead = false;
          readBool = true;

          //html stuff for display
          output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
          f.size, ' bytes, last modified: ',
          f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
          '</li>');


        }
        document.getElementById('fileInfo').innerHTML = '<ul>' + output.join('') + '</ul>';
      }


      reader.onerror = function(){
        //default readBool to false if somehow the reader onload event is not fired or there is an error
        readBool = false;
        console.log('FileReader error with reading file');
      }
      reader.readAsText(file);
    }
    document.getElementById('files').addEventListener('change', handleFileSelect, false);

    var jssse = Object.create(SasMol.SasMol);



    /**************************************************************************
      DEVELOPER CODE
      *************************************************************************/

      $(".board")
      .sortable({
        items: ".sortable",
        placeholder: 'SSE placeholder',
        forceHelperSize: true,
        tolerance:'pointer',
        handle: '.handle',
        scroll: false,
        cursor: 'move'
      });
    var closeButtons = document.getElementsByClassName('close');
    var board = document.getElementById('board');
      closeButtons[0].addEventListener('click', function(e){
        //close window
        console.log(e.target);
        //$('#closeButton').remove();
      });




  // $('#widget-container').dialog({
  //   title: 'JSSSE WIDGET',
  //   height: 300,
  //   width:500
  // });

  function populateWindows(sobjID){
    //console.log(sobjID);
    var sobj = document.getElementById(sobjID);
    //create div elt's
    for(var i = 0; i < numPDB; i++){
      //main sequence display
      var widgetContainer = document.createElement('div');
      //widgetContainer.style.textAlign = 'center';
      widgetContainer.classList.add('widget-container');
      widgetContainer.id = 'widget-container'+i;
      //widgetContainer.style.position = 'absolute';

      var sequenceContainer = document.createElement('div');
      sequenceContainer.classList.add('sequenceContainer');
      sequenceContainer.style.position = 'relative';
      var sequenceDiv = document.createElement('div');
      sequenceDiv.classList.add('sequenceDiv');
      sequenceDiv.id = 'sequenceDiv'+i;
      sequenceDiv.tabIndex = '0';
      var marker = document.createElement('div');
      marker.classList.add('marker');
      var customSelector = document.createElement('div');
      customSelector.classList.add('customSelector');
      customSelector.style.height=  '100%';
      var locatorDiv = document.createElement('div');
      locatorDiv.classList.add('locatorDiv');
      var locatorBox = document.createElement('div');
      locatorBox.classList.add('locatorBox');
      var zoomDiv = document.createElement('div');
      zoomDiv.classList.add('zoomDiv');
      locatorDiv.appendChild(locatorBox);
      sequenceDiv.appendChild(marker);
      sequenceDiv.appendChild(customSelector);
      sequenceDiv.appendChild(locatorDiv);
      // sequenceDiv.appendChild(customSelector);

      sequenceContainer.appendChild(sequenceDiv);
      sequenceContainer.appendChild(zoomDiv);

      var sequenceSelInfoDiv = document.createElement('div');
      sequenceSelInfoDiv.classList.add('sequenceSelInfoDiv');
      sequenceSelInfoDiv.style.display = 'inline-block';
      sequenceSelInfoDiv.style.textAlign = 'center';
      var div = document.createElement('div');
      var title = document.createElement('strong');
      var titleText = document.createTextNode('CURRENT SELECTION');
      title.appendChild(titleText);
      var div2 = document.createElement('div');
      div2.style.textAlign = 'center';
      var clearSelBtn = document.createElement('button');
      clearSelBtn.classList.add('clearSelection');
      var clearSelBtnText = document.createTextNode('Clear Selection');
      var startSpan = document.createElement('span');
      var startText = document.createTextNode('START ');
      var startIndex = document.createElement('span');
      startIndex.classList.add('startIndex');
      var endSpan = document.createElement('span');
      var endText = document.createTextNode(' : END ');
      var endIndex = document.createElement('span');
      endIndex.classList.add('endIndex');

      var selectDisplay = document.createElement('div');
      selectDisplay.classList.add('selectDisplay');

      var selectDisplayRange = document.createElement('div');
      selectDisplayRange.classList.add('selectDisplayRange');

      selectDisplay.appendChild(selectDisplayRange);
      sequenceSelInfoDiv.appendChild(div);

      clearSelBtn.appendChild(clearSelBtnText);
      div2.appendChild(clearSelBtn);
      div.appendChild(title);
      div.appendChild(div2);
      startSpan.appendChild(startText);
      div.appendChild(startSpan);
      div.appendChild(startIndex);
      endSpan.appendChild(endText);
      div.appendChild(endSpan);
      div.appendChild(endIndex);
      div.appendChild(selectDisplay);


      widgetContainer.appendChild(sequenceSelInfoDiv);
      widgetContainer.appendChild(sequenceContainer);
      //append to sobj
      sobj.appendChild(widgetContainer);

      //add event listeners
      //add clear selection functionality
      //var btn = document.getElementById('clearSelection');
      clearSelBtn.addEventListener('click',function(e){
        clearAllSelection(widgetIndex);
      });
      //add marker to follow mouse in div
      sequenceDiv.addEventListener('mousemove', function(e){
        seqDivFlag = true;
        var seqDivPosition = getPosition(sequenceDiv);
        //console.log('mousein '+ (e.pageX - seqDivPosition.x));
        marker.style.display = 'block';
        marker.style.left = (e.pageX - seqDivPosition.x)+'px';
        locatorBox.style.display = 'inline-block';

        //only display locator if there's a valid PDB being read
        if(readBool){
          //console.log(e.pageX - seqDivPosition.x);
          displayLocator(getIndexByWidth(e.pageX - seqDivPosition.x, widgetIndex), widgetIndex);
        }

      });

      sequenceDiv.addEventListener('mouseleave',function(e){
        seqDivFlag = false;
        //console.log('mouseout '+e.clientX);
        marker.style.display = 'none';
        locatorDiv.style.display = 'none';
      });
      //listen to right-click
      sequenceDiv.addEventListener('contextmenu',function(e){
        //clearAllSelection();
        sequenceDiv.focus();
      });





      var widgetIndex = i;

      //push to arrays
      seqContainerArr[i] = sequenceContainer;
      seqDivArr[i] = sequenceDiv;
      locatorDivArr[i] = locatorDiv;
      locatorBoxArr[i] = locatorBox;
    //  console.log(i);

      zoomDivArr[i] = zoomDiv;
      seqSelDivArr[i] = selectDisplay;
      seqSelRangeDivArr[i] = selectDisplayRange;
      startIndexArr[i] = startIndex;
      endIndexArr[i] = endIndex;


    }
    loadBool = true;
  }

//DOCUMENT EVENT LISTENERS
//make keypress event general (only open if there exists a value to be_zoomed in on)
document.addEventListener('keydown',function(e){

  var activeElt = document.activeElement;
  if(e.shiftKey && seqDivFlag && (activeElt.className == 'sequenceDiv')){
    zoomPress = true;

    //extract id
    var reg = /(\d)/;
    var widgetIndex = reg.exec(activeElt.id)[1];
    //console.log(widgetIndex);

    zoomDivArr[widgetIndex].style.display = 'block';
    if((parseInt(locatorBoxArr[widgetIndex].innerText) < objSelArr[widgetIndex].length)){

      var info = Object.keys(objSelArr[widgetIndex][parseInt(locatorBoxArr[widgetIndex].innerText)])[0];
      populateZoomDiv(info, widgetIndex);
    }
    //console.log(info);

    currentZoomedWidget = widgetIndex;
    //console.log(resname + ' ' + resid);
  }



});
//can't just listen to keyup
document.addEventListener('keyup',function(e){
  if(zoomPress){
    //remove 'zoomed' class from primary seq
    for(var i = 0; i < zoomMasterArr[currentZoomedWidget].length; i++){
      //document.getElementById(zoomArr[i]).classList.remove('zoomed-middle');
      document.getElementById(zoomMasterArr[currentZoomedWidget][i]).classList.remove('zoomed-lefthook');
      document.getElementById(zoomMasterArr[currentZoomedWidget][i]).classList.remove('zoomed-righthook');
    }
    zoomMasterArr[currentZoomedWidget] = [];
    //console.log('we out');
    zoomDivArr[currentZoomedWidget].style.display = 'none';
    zoomPress = false;
  }

});

  //if(loadBool){
  //JSSSE OBJECT should provide # of residues, array of objects in such format
  var num;
  /**
   * @example
   GLOBAL OBJECT Array definition
   format: [{res#: _uuid}, ...  ]
   res: [{ala1: '_8vmw96mko'}, {glu2: '_y6cdst2mm'}, ...]
   */
   //access DOM elt's by classname (not id because they are not unique - multiple selects)
   var seqContainerArr = [];
   var seqDivArr = [];
   //seqDiv.focus();
   var locatorDivArr = [];
   var locatorBoxArr = [];
   //subtract pixels from border
   var seqDivWidthArr = [];
   var zoomDivArr = [];
   var seqSelDivArr = [];
   var seqSelRangeDivArr = [];

   var eltWidthArr = [];

   var dsArr = [];
   var zoomdsArr = [];
   var arrDispArr = [];
   var zoomMasterArr = [];
   var objSelArr = [];
   var startIndexArr = [];
   var endIndexArr = [];
   var seqDivFlag = false;
   var currentZoomedWidget;
  // var seqContainer = document.getElementById('sequenceContainer');
  // var seqDiv = document.getElementById('sequenceDiv');
  // //seqDiv.focus();
  // var locatorDiv = document.getElementById('locatorDiv');
  // var locatorBox = document.getElementById('locatorBox');
  // //subtract pixels from border
  // var seqDivWidth;
  // var zoomDiv = document.getElementById('zoomDiv');
  // var seqSelDiv = document.getElementById('selectDisplay');
  // var seqSelRangeDiv = document.getElementById('selectDisplayRange');
  // var seqSelDetDiv = document.getElementById('selectDisplayDetails');
  // var objSelArr[widgetIndex] = [];
   var zoomArr = [];
  //var objSelArr[widgetIndex] = {};
  var type = 'res';
  var arrDisp = [];
  var aminoAcidArr = [
    'ala', 'arg', 'asn', 'asp', 'cys', 'gln', 'glu', 'gly', 'his','ile','leu','lys', 'met', 'phe', 'pro', 'ser', 'thr','trp', 'tyr', 'val'
  ];

  var eltWidth;
  var zoomPress = false;
  var multiSelect = false;


//initialize residues inside divs
  function initialize(action, object, widgetIndex){
    var seqDiv = seqDivArr[widgetIndex];
    objSelArr[widgetIndex] = [];
    //objSelArr[widgetIndex][widgetIndex] = [];
    //console.log(object);
    if(action=='reload'){
      $('.sequenceDiv '+ widgetIndex).find('.res').remove();
      $('.sequenceDiv '+ widgetIndex).find('.dividers').remove();
          //console.log('resized');

          objSelArr[widgetIndex][widgetIndex] = [];

          // initialize('reload');
          // dsArr[widgetIndex].stop();
          // dsArr[widgetIndex].start();
          //console.log(dsArr[widgetIndex].getSelection());
          //dsArr[widgetIndex].setSelection(dsArr[widgetIndex].getSelection());
          //dsArr[widgetIndex].addSelectables(document.getElementsByClassName('res'));
          //zoomdsArr[widgetIndex].start();
    }

    //update calculation
    var seqDivWidth = seqDivArr[widgetIndex].offsetWidth-4;
    //console.log(obj);
    //initialize span elements
    for(var i=0;i<num;i++){

      var newSpan = document.createElement('span');
      newSpan.className = 'res';
      newSpan.style.width = (seqDivWidth/num) + 'px';
      //if(action == 'start'){
        //placeholder unique ids (before implementing readPDB)
        //newSpan.id = '_' + Math.random().toString(36).substr(2, 9);
        //newSpan.id = object.getResID()[i];
        newSpan.id = 'pdb'+numPDB+'_'+'atom'+object.getAtom()[i];
        //assuming res id's unique, make keys ordered and sorted to make later arithmetic easier (parse obj for string instead of res)

        //var key = aminoAcidArr[Math.floor(Math.random() * Math.floor(aminoAcidArr.length-1))]+(i+1);
        //console.log(object.getResname()[i]);
        //console.log(object.getAtom()[i]);
        var key = object.getName()[i] + " "+ object.getAtom()[i].toString();
        //var key = 'res'+i;
        var obj = {};
        obj[key] = newSpan.id;
        objSelArr[widgetIndex].push(obj);
        //objSelArr[widgetIndex][key]=newSpan.id;
      //}
      // else if (action == 'reload'){
      //   //console.log(objSelArr[widgetIndex][i-1][Object.keys(objSelArr[widgetIndex][i - 1])]);
      //   //newSpan.id = objSelArr[widgetIndex][i-1][Object.keys(objSelArr[widgetIndex][i - 1])];
      //   newSpan.id = objSelArr[widgetIndex][i][Object.keys(objSelArr[widgetIndex][i])];
      //   //account for selections made before
      //   var selection = dsArr[widgetIndex].getSelection();
      //   for(var j = 0; j < selection.length; j++){
      //     if(newSpan.id == selection[j].id){
      //       newSpan.classList.add('ds-selected');
      //
      //     }
      //   }
      // }
      //newSpan.id = i;
      seqDiv.appendChild(newSpan);

      //if(i==0){console.log(newSpan.offsetLeft);}
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
      eltWidth = document.querySelectorAll('.res')[0].getBoundingClientRect().width;
      //ensure that the new elt's are added to the dragselect
      //dsArr[widgetIndex].addSelectables(document.getElementsByClassName('res'));

      seqDivWidthArr[widgetIndex] = seqDivWidth;
      eltWidthArr[widgetIndex] = eltWidth;
      console.log(objSelArr);

      //initiate dragselectors
        var ds = new DragSelect({
        selectables: document.getElementsByClassName('res'),
        area: seqDiv,
        multiSelectKeys: ['ctrlKey'],
        onDragMove: function(e){
          var selection = dsArr[widgetIndex].getSelection();
          //only do computations if there selection array isn't empty
          if(selection.length>0){
            var lastElt = selection[selection.length-1].id;
            //console.log("lastELt: "+lastElt);
            var matchedKey = getKeyByValue(objSelArr[widgetIndex], lastElt);

            //console.log(matchedKey);
            updateCurrSelection(matchedKey, type, 'endIndex', 'update', widgetIndex);
          }
        },
        onDragStart: function(e){
          var selection = dsArr[widgetIndex].getSelection();
          //console.log(selection);
          //var firstElt = selection[0].id;
          //only do computations if there selection array isn't empty
          if(selection.length>0){
            var lastElt = selection[selection.length-1].id;
            //console.log(lastElt);
            var matchedKey = getKeyByValue(objSelArr[widgetIndex], lastElt);
            updateCurrSelection(matchedKey, type, 'startIndex', 'update', widgetIndex);
          }


        },
        //onElementSelect: function(e){console.log(e);},
        callback: function(){
          //clear all elements first
          $('.res.zoom').remove();



          var selection = dsArr[widgetIndex].getSelection();
          if(selection.length==0){
            updateCurrSelection('','','startIndex',0, widgetIndex);
            updateCurrSelection('','','endIndex',0, widgetIndex);
          }
          calibrateDisp(widgetIndex);
          updateSelDisplay(widgetIndex);
          //console.log('sel array start: '+getKeyByValue(objSelArr[widgetIndex], selection[0].id));
          //console.log('sel array end: '+getKeyByValue(objSelArr[widgetIndex], selection[selection.length-1].id));
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
        selector: document.getElementsByClassName('customSelector')[widgetIndex],
        onElementSelect: function(item){
          mirror(item,'select', widgetIndex);
        },
        onElementUnselect: function(item){
          mirror(item,"unselect", widgetIndex);
        }

      });

      //instantiate new dragselect within zoombox
      var zoomds = new DragSelect({
        multiSelectKeys: ['ctrlKey'],
        area:zoomDivArr[widgetIndex],
        onDragMove: function(e){

          var selection = zoomdsArr[widgetIndex].getSelection();

          //only do computations if there selection array isn't empty
          if(selection.length>0){
            //SUBJECT TO CHANGE
            // var regex = /(\d+)/;
            var regex = /pdb(\d*)_[^_]*/;
            //equivID = regex.exec(item.id)[1];
            var lastElt = regex.exec(selection[selection.length-1].id)[0];
            //var lastElt = selection[selection.length-1].id;
            var matchedKey = getKeyByValue(objSelArr[widgetIndex], lastElt);

            //console.log(matchedKey);
            updateCurrSelection(matchedKey, type, 'endIndex', 'update', widgetIndex);
          }
        },
        onDragStart: function(e){
          var selection = zoomdsArr[widgetIndex].getSelection();
          //console.log(selection);
          //var firstElt = selection[0].id;
          //only do computations if there selection array isn't empty
          if(selection.length>0){
            // var regex = /(\d+)/;
            var regex = /pdb(\d*)_[^_]*/;
            var lastElt = regex.exec(selection[selection.length-1].id)[0];
            //var lastElt = selection[selection.length-1].id;

            console.log(lastElt);
            var matchedKey = getKeyByValue(objSelArr[widgetIndex], lastElt);
            updateCurrSelection(matchedKey, type, 'startIndex', 'update', widgetIndex);
          }


        },
        onElementSelect: function(item){
          mirror(item,'select', widgetIndex);
        },
        onElementUnselect: function(item){
          //console.log(item);
          mirror(item,"unselect", widgetIndex);
        },
        callback: function(){
          //console.log('hi');
          var selection = dsArr[widgetIndex].getSelection();
          console.log(selection);

          if(selection.length==0){
            updateCurrSelection('','','startIndex',0, widgetIndex);
            updateCurrSelection('','','endIndex',0, widgetIndex);
          }
          calibrateDisp(widgetIndex);
          updateSelDisplay(widgetIndex);
        }
        //,selectables: document.getElementsByClassName('res')
      });
      dsArr[widgetIndex] = ds;
      zoomdsArr[widgetIndex] = zoomds;
      //console.log(dsArr);
      document.getElementById('widget-container'+widgetIndex).style.position = 'absolute';
  }





//JQUERY STUFF (RESIZING WINDOW HAS BUGS)
// $('#sequenceContainer').on( 'dialogresizestop',
//   function(event,ui){
//
//     $('.res').remove();
//     $('.divider').remove();
//     //console.log('resized');
//
//     //objSelArr[widgetIndex] = [];
//
//     initialize('reload');
//     // dsArr[widgetIndex].stop();
//     // dsArr[widgetIndex].start();
//     console.log(dsArr[widgetIndex].getSelection());
//     //dsArr[widgetIndex].setSelection(dsArr[widgetIndex].getSelection());
//     dsArr[widgetIndex].addSelectables(document.getElementsByClassName('res'));
//     //zoomdsArr[widgetIndex].start();
//   }
// );

// HELPER FUNCTIONS
//helper function for mirroring selection/unselection between primary sequence div and zoom div
function mirror(item,type, widgetIndex){
  var zoomSel = zoomdsArr[widgetIndex].getSelection();
  var mainSel = dsArr[widgetIndex].getSelection();

  //SUBJECT TO CHANGE (depends on ID)
  //var regex = /pdb(\d+)_atom(.*)/;
  var regex = /pdb(\d*)_[^_]*/;
  equivID = regex.exec(item.id)[0];
  //console.log(equivID);
  if(type == "unselect"){
    //console.log('UNSELECTED');
    //console.log(item);
    dsArr[widgetIndex].removeSelection(document.getElementById(equivID));
    if(document.getElementsByClassName('zoomDiv')[widgetIndex].childNodes.length > 1){
      zoomdsArr[widgetIndex].removeSelection(document.getElementById(equivID+'_zoomed'));
    }
  }
  else if(type =="select"){
    //console.log(item);
    dsArr[widgetIndex].addSelection(document.getElementById(equivID));
    if(document.getElementsByClassName('zoomDiv')[widgetIndex].childNodes.length > 1){
      zoomdsArr[widgetIndex].addSelection(document.getElementById(equivID+'_zoomed'));
    }
  }
}


var objArrKeyIndex =-1;
function arrUpdate(val, option, widgetIndex){
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
  // console.log(arrDisp);
  //console.log(arrDisp[0]['arr'+objArrKeyIndex]);
  //console.log('length: '+arrDisp.length);
}
function updateCurrSelection(text, type, spanClass, mode, widgetIndex){

  //dynamically display current selection:
  var str = '';
  if (mode=='update'){
      //console.log(text);
     str = (parseKey(text, type)).toString();

  }
  document.getElementsByClassName(spanClass)[widgetIndex].innerText = str;
}

function updateSelDisplay(widgetIndex){
  //add display for SELECTION
  var len=arrDispArr[widgetIndex].length;
  //console.log(arrDispArr[widgetIndex]);
  //clear children first
  while (seqSelRangeDivArr[widgetIndex].firstChild) {
    seqSelRangeDivArr[widgetIndex].removeChild(seqSelRangeDivArr[widgetIndex].firstChild);
  }
  //detail div nonexistent
  // while (seqSelDetDiv.firstChild) {
  //   seqSelDetDiv.removeChild(seqSelDetDiv.firstChild);
  // }
  if(len>0){

    for(var i=0;i<len;i++){
      //initialize 'from' text
      var selspan = document.createElement('span');
      var selInfospan = document.createElement('span');
      //startCount.style.margin = '0px 2px';
      var subarray = arrDispArr[widgetIndex][i]['arr'+i];
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
      //console.log('we here');
      seqSelRangeDivArr[widgetIndex].appendChild(selspan);

    }
  }
}
//helper method for clearing selection (making selection array zero, removing DOM children elements)
function clearAllSelection(widgetIndex){
  dsArr[widgetIndex].clearSelection();
  $('.ds-selected').remove();
  arrDisp.length=0;
  updateSelDisplay(widgetIndex);
  updateCurrSelection('','','startIndex','clear',widgetIndex);
  updateCurrSelection('','','endIndex','clear',widgetIndex);

}
//split selection array into consecutive subarrays; called when selection is made
function calibrateDisp(widgetIndex){
  //console.log(widgetIndex);
  objArrKeyIndex = -1;
  //reset array
  arrDisp=[];

  var arrSorted = [];
  var len=dsArr[widgetIndex].getSelection().length;
  var currKey;
  var prevKey;

  //1. sort Array
  for(var i=0; i<len;i++){
    //console.log(sel[i].id);
    //var reg = /(\d+)/;
    var reg = /pdb(\d*)_[^_]*/;
    //regex.exec(selection[selection.length-1].id)[1]
    //console.log(reg.exec(dsArr[widgetIndex].getSelection()[i].id));
    currKey = parseKey(getKeyByValue(objSelArr[widgetIndex], reg.exec(dsArr[widgetIndex].getSelection()[i].id)[0]), type);
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

    arrDispArr[widgetIndex] = [];
    arrDispArr[widgetIndex] = arrDisp;

  }
  //console.log(arrDisp);
}
function parseKey(text, type){
  //instead of type, use general 3 letters for residue name?
  var reg;
  if(type=='res'){
    //console.log(text);
    //reg = new RegExp('\\w{1,3}(\\d+)', 'g');
    reg = /(.+)\s(.+)/;
  }

  //console.log("text to parse: "+text);
  //console.log("reg to parse: "+reg);
  var res = parseInt(reg.exec(text)[2]);
  //console.log("result: "+res);
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


  function displayLocator(loc, widgetIndex){
    locatorDivArr[widgetIndex].style.display='block';
    locatorBoxArr[widgetIndex].innerText=loc;
  }
  function getIndexByWidth(x, widgetIndex){
    return Math.ceil(x/eltWidthArr[widgetIndex]);
  }
  function populateZoomDiv(val, widgetIndex){
    //clear children except selector box
    while(zoomDivArr[widgetIndex].children.length>1){
      zoomDivArr[widgetIndex].removeChild(zoomDivArr[widgetIndex].lastChild);
    }
    var zoomRangeLeft;
    var zoomRangeWidth;
    //SUBJECT TO CHANGE
    //var reg = /(\w{1,3})(\d+)/;
    var reg = /(.+)\s(\d+)/;
    var resname = reg.exec(val)[1];
    var resid = parseInt(reg.exec(val)[2]);

    // MAKE MODULAR
    var lorange = resid - 6;
    if(resid <= 5){
      lorange = 0;
    }
    var hirange = resid + 5;
    if(hirange > objSelArr[widgetIndex].length){
      hirange = objSelArr[widgetIndex].length;
    }
    for(var i = lorange; i<hirange;i++){
      var resZoom = document.createElement('span');
      resZoom.className = 'res';
      var info  = Object.keys(objSelArr[widgetIndex][i])[0];
      resname = reg.exec(info)[1];
      resid = parseInt(reg.exec(info)[2]);
      resZoom.innerText = resname + '\n' + resid;
      var id = Object.values(objSelArr[widgetIndex][i])[0];
      resZoom.id = id+'_zoomed' ;
      resZoom.style.height = '30px';
      resZoom.style.width = '30px';
      resZoom.style.fontSize = '14px';
      resZoom.style.margin = '5px';
      resZoom.style.border = '1px solid black';
      // resZoom.style.lineHeight = '30px';
      //resZoom.style.top = '30%';
      zoomDivArr[widgetIndex].appendChild(resZoom);
      zoomdsArr[widgetIndex].addSelectables(resZoom);

      //mirror because spawning these new spans are called after selection in primary seq div
      var mirrorItem = document.getElementById(id);

      if(mirrorItem.className.includes('ds-selected')){
        mirror(mirrorItem,"select", widgetIndex);
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
      //add to zoom arr (use push instead of assignment b/c i is not zero-indexed)
      zoomArr.push(id);

    }
    zoomMasterArr[widgetIndex] = zoomArr;
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

//}//end of loadbool conditional



} );//end of jQuery.ready()
