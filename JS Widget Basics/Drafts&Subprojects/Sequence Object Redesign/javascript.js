//bring in definitions (SASMOL and JSSSE)
var SasMol = require('../../SASMOL\ JS/sasmol.js');
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
    var readBool = false;
    var numPDB = 0;
    var loadBool = false; //(debugging purposes - may be important in the future)
    var numAtomsArr = [];


    var jssseArr = [];
    var sobjArr = ['sobj1','sobj2'];

//use Promises to wait until async operation is finished (initialize + populate windows correctly)
//src: https://stackoverflow.com/questions/41906697/how-to-determine-that-all-the-files-have-been-read-and-resolve-a-promise/
function readFile(file) {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        reader.onerror = reader.onabort = reject;
        reader.readAsText(file);
    });
}
function readmultifiles(files) {
    var results = [];
    files.reduce(function(p, file) {
        return p.then(function() {
            return readFile(file).then(function(data) {
                // put this result into the results array
                results.push(data);
            });
        });
    }, Promise.resolve()).then(function() {
        // make final resolved value be the results array
        // DEMO
        //console.log(results);

        //populate JSSSE objects and canvas windows
        readBool = true;
        numPDB = results.length;
        var info = "";
        for(var i = 0; i<numPDB;i++){
          info = results[i];
          jssseArr[i] = Object.create(SasMol.SasMol);
          //store read information inside jssse objects
          jssseArr[i].readPDB(info);

          numAtomsArr[i] = jssseArr[i].getAtom().length;

        }

        //DEMO
        for(var i = 0; i<numPDB;i++){
          populateWindows(sobjArr[i], jssseArr[i]);
          initialize('start', jssseArr[i],i);
        }
        return results;
    });
}

function handleRead(e){
  var files = e.target.files;
  var fileArr = [];
  //convert fileList to array of files
  for(var i = 0,f;f=files[i];i++){
    fileArr[i]=f;
  }
  readmultifiles(fileArr);

}
//listen to when user inputs file(s) (event is triggered once user inputs file(s))
document.getElementById('files').addEventListener('change', handleRead, false);




    /*
  ____  ____  _  _  ____  __     __  ____  ____  ____     ___  __  ____  ____
(    \(  __)/ )( \(  __)(  )   /  \(  _ \(  __)(  _ \   / __)/  \(    \(  __)
 ) D ( ) _) \ \/ / ) _) / (_/\(  O )) __/ ) _)  )   /  ( (__(  O )) D ( ) _)
(____/(____) \__/ (____)\____/ \__/(__)  (____)(__\_)   \___)\__/(____/(____)
    */
// GLOBAL VARIABLES FOR keeping track of HTML within (potentially) multiple SOBJ's

   //access DOM elt's by classname (not id because they are not unique - multiple selects)
   var widgetContainerArr = [];
   var seqContainerArr = [];
   var seqDivArr = [];
   var locatorDivArr = [];
   var locatorBoxArr = [];
   var seqDivWidthArr = [];
   var zoomDivArr = [];
   // var seqSelDivArr = []; //for future reference?
   var seqSelRangeDivArr = [];

   var eltWidthArr = [];

   var dsArr = [];
   var zoomdsArr = [];
   var seqObjArr = [];        //Master array for all sequence objects
   var currentZoomedWidget;
  // var aminoAcidArr = [
  //   'ala', 'arg', 'asn', 'asp', 'cys', 'gln', 'glu', 'gly', 'his','ile','leu','lys', 'met', 'phe', 'pro', 'ser', 'thr','trp', 'tyr', 'val'
  // ];

  var eltWidth;
  var zoomPress = false;  //flag for pressing zoom
  var seqDivFlag = false; //flag for entering sequence Div (toggles on marker and locatorDiv)



//CREATE SEQUENCE OBJECT
//makes sobj's jquery-sortable (replacable when dragged over each other)
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
    //ADD EVENT LISTENERS TO DO THINGS WITH CLOSE BUTTON

/**
 * Populates windows attached to sobj's (all HTML necessary for sequence divs, feedback box, zoom div)
 * @param  {String} sobjID [description]
 * @param {sasmol}
 */
  function populateWindows(sobjID, object){
    //console.log(sobjID);
    var sobjContent = document.getElementById(sobjID+' content');
    //create div elt's
    for(var i = 0; i < numPDB; i++){
      var sobjIndex = i;
      //main sequence display
      var widgetContainer = document.createElement('div');
      //widgetContainer.style.textAlign = 'center';
      widgetContainer.classList.add('widget-container');
      widgetContainer.id = 'widget-container'+sobjIndex;
      //widgetContainer.style.position = 'absolute';

      var sequenceContainer = document.createElement('div');
      sequenceContainer.classList.add('sequenceContainer');
      sequenceContainer.style.position = 'relative';
      var sequenceDiv = document.createElement('div');
      sequenceDiv.classList.add('sequenceDiv');
      sequenceDiv.id = 'sequenceDiv'+sobjIndex;
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
      //append to sobj (top-level HTML elt)
      sobjContent.appendChild(widgetContainer);

      //add event listeners
      //add clear selection functionality
      clearSelBtn.addEventListener('click',function(e){
        clearAllSelection(sobjIndex);
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
          //refer to helper function to geometrically get sequence index
          displayLocator(getIndexByWidth(e.pageX - seqDivPosition.x, sobjIndex), sobjIndex);
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
        sequenceDiv.focus();
      });

      //what to do when update is clicked - make copy of current selection into a jQuery-droppable object
      document.getElementsByClassName('btn update')[0].addEventListener('click', function(e){
        //clear seqPieces first
        $('#seqPiece'+sobjIndex).remove();
        $('#drop'+sobjIndex).remove();
        console.log(JSON.stringify(arrDisp));
        var seqPiece = document.createElement('div');
        seqPiece.classList.add('seqPiece');
        seqPiece.id = 'seqPiece'+sobjIndex;
        var text = document.createTextNode(JSON.stringify(arrDisp));
        seqPiece.appendChild(text);
        sobjContent.appendChild(seqPiece);

        var dropDiv = document.createElement('div');
        dropDiv.classList.add('drop');
        dropDiv.id = 'drop'+sobjIndex;

        document.getElementById('builder-canvas').appendChild(dropDiv);
        $('.drop').droppable({
            tolerance: 'intersect',
            drop: function(event, ui) {
                var drop_p = $(this).offset();
                var drag_p = ui.draggable.offset();
                var left_end = drop_p.left - drag_p.left + 1;
                var top_end = drop_p.top - drag_p.top + 1;
                ui.draggable.animate({
                    top: '+=' + top_end,
                    left: '+=' + left_end
                });
            }
        });
        $('#seqPiece'+sobjIndex).draggable({
            revert: 'invalid',
            scroll: false,
            stack: ".seqPiece"
        });
      });

      //MAKE MODULAR + ADD MORE ELEMENTS
      var sasmolInfoDiv = document.createElement('div');

      function populateSasMolInfo(param){
        var propDiv = document.createElement('div');
        var propInfo = document.createElement('div');
        var propCheckBox = document.createElement('input');
        var propTitle = document.createTextNode(param.title + ': ');
        var propText = document.createTextNode(param.info);
        propDiv.style.textAlign = 'left';
        propInfo.appendChild(propText);
        propInfo.style.display = 'none'
        propCheckBox.type = 'checkbox';
        propCheckBox.id = 'propCheckBox'+sobjIndex;
        propDiv.appendChild(propCheckBox);
        propDiv.appendChild(propTitle);
        propDiv.appendChild(propInfo);

        sasmolInfoDiv.appendChild(propDiv);
        sobjContent.appendChild(sasmolInfoDiv);
        //toggles display on or off based on if the checkbox is ticked
        propCheckBox.addEventListener('click', function(e){
          if(!propCheckBox.checked){
            propInfo.style.display = 'none'
          }
          else{
            propInfo.style.display = 'block';
          }
        });
      }
      var segnameObj = {
        title: 'SEGNAME',
        info: JSON.stringify(object.getSegname())
      };
      var betaObj = {
        title: 'BETA',
        info: JSON.stringify(object.getBeta())
      };
      populateSasMolInfo(segnameObj);
      populateSasMolInfo(betaObj);


      //push to arrays
      widgetContainerArr[i] = widgetContainer;
      seqContainerArr[i] = sequenceContainer;
      seqDivArr[i] = sequenceDiv;
      locatorDivArr[i] = locatorDiv;
      locatorBoxArr[i] = locatorBox;

      zoomDivArr[i] = zoomDiv;
      // seqSelDivArr[i] = selectDisplay;
      seqSelRangeDivArr[i] = selectDisplayRange;



    }
    //populate PDB memory box
    var output = [];
    //SUBJECT TO CHANGE
    //ex: chain A is hardcoded (future goal: make modular after implementing read MODEL/chain)
    output.push('<li>', 'chain A','<ul>');
    for(var i = 0; i<numAtomsArr[sobjIndex]; i++){
      //iterate through atoms and display in bullets
      output.push('<li>', object.getAtom()[i], '</li>');
    }
    //end of ul
    output.push('</ul>','</li>');
    document.getElementById('pdb_memory').innerHTML = '<ul>' + output.join('') + '</ul>';
    //(Debugging purposes)
    loadBool = true;
  }

//DOCUMENT EVENT LISTENERS
//make keypress event general (only open if there exists a value to be_zoomed in on)
document.addEventListener('keydown',function(e){

  var activeElt = document.activeElement;
  if(e.shiftKey && seqDivFlag && (activeElt.className == 'sequenceDiv')){
    //switch on flag
    zoomPress = true;

    //extract id
    var reg = /(\d)/;
    var sobjIndex = reg.exec(activeElt.id)[1];
    //console.log(sobjIndex);

    zoomDivArr[sobjIndex].style.display = 'block';
    if((parseInt(locatorBoxArr[sobjIndex].innerText) < seqObjArr[sobjIndex].length)){

      var index = parseInt(locatorBoxArr[sobjIndex].innerText);
      populateZoomDiv(index, sobjIndex);
    }

    currentZoomedWidget = sobjIndex;
  }



});
//Keyup event doesn't apply to a specific key so use a flag to check if zoom was held before
document.addEventListener('keyup',function(e){
  if(zoomPress){
    //remove all HTML for marking zoom ranges
    for(var i = 0; i< document.querySelectorAll('.zoomed-lefthook').length;i++){
      document.querySelectorAll('.zoomed-lefthook')[i].classList.remove('zoomed-lefthook');
      document.querySelectorAll('.zoomed-righthook')[i].classList.remove('zoomed-righthook');
    }

    zoomDivArr[currentZoomedWidget].style.display = 'none';
    //switch off flag
    zoomPress = false;
  }

});


//initialize sequence objects inside divs
  function initialize(action, object, sobjIndex){
    var seqDiv = seqDivArr[sobjIndex];
    seqObjArr[sobjIndex] = [];
    var num = numAtomsArr[sobjIndex];
    // Logic to make divs responsive (FOR FUTURE DEVELOPMENT - would have to re-initialize everything)
    if(action=='reload'){
      $('.sequenceDiv '+ sobjIndex).find('.res').remove();
      $('.sequenceDiv '+ sobjIndex).find('.dividers').remove();
          //console.log('resized');

          seqObjArr[sobjIndex][sobjIndex] = [];
    }

    //update calculation
    var seqDivWidth = seqDivArr[sobjIndex].offsetWidth-4;
    //console.log(obj);
    //initialize span elements
    for(var i=0;i<num;i++){

      var newSpan = document.createElement('span');
      newSpan.className = 'res';
      newSpan.style.width = (seqDivWidth/num) + 'px';
      //if(action == 'start'){
        //placeholder unique ids (before implementing readPDB)
        newSpan.id = '_' + Math.random().toString(36).substr(2, 9);
        //MODULAR
        var seqObj = {
          sasAtom: object,
          dom_id : newSpan.id,
          zoomed : false,
          selected : false,
          pdbIndex : sobjIndex,
          zoomText : object.getName()[i],
          seqObjArrIndex: i
        };
        seqObjArr[sobjIndex][i] = seqObj;
      //newSpan.id = i;
      seqDiv.appendChild(newSpan);


      //insert dividers
      var newDivider = document.createElement('div');
      newDivider.className = 'divider';
      //logic for how limits on dividers
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
      //dsArr[sobjIndex].addSelectables(document.getElementsByClassName('res'));

      seqDivWidthArr[sobjIndex] = seqDivWidth;
      eltWidthArr[sobjIndex] = eltWidth;
      console.log(seqObjArr);

      //initiate dragselectors
        var ds = new DragSelect({
        selectables: document.getElementsByClassName('res'),
        area: seqDiv,
        multiSelectKeys: ['ctrlKey'],
        onDragMove: function(e){
          var selection = dsArr[sobjIndex].getSelection();
          //only do computations if there selection array isn't empty
          if(selection.length>0){
            var lastEltID = selection[selection.length-1].id;
            //console.log("lastELt: "+lastElt);
            var obj = getObjectByValue(seqObjArr[sobjIndex], lastEltID);

            updateCurrSelection('endIndex', obj, sobjIndex);
          }
        },
        onDragStart: function(e){
          var selection = dsArr[sobjIndex].getSelection();
          //only do computations if there selection array isn't empty
          if(selection.length>0){
            var lastEltID = selection[selection.length-1].id;
            //console.log("lastELt: "+lastElt);
            var obj = getObjectByValue(seqObjArr[sobjIndex], lastEltID);

            updateCurrSelection('startIndex', obj, sobjIndex);
          }


        },
        //onElementSelect: function(e){console.log(e);},
        callback: function(){
          var selection = dsArr[sobjIndex].getSelection();
          if(selection.length==0){
            updateCurrSelection('startIndex', {atomNum: ""}, sobjIndex);
            updateCurrSelection('endIndex',{atomNum: ""}, sobjIndex);
          }
          calibrateDisp(sobjIndex);
          updateSelDisplay(sobjIndex);

        },
        selector: document.getElementsByClassName('customSelector')[sobjIndex],
        onElementSelect: function(item){
          mirror(item,'select', sobjIndex);
        },
        onElementUnselect: function(item){
          mirror(item,"unselect", sobjIndex);
        }

      });

      //instantiate new dragselect within zoombox
      var zoomds = new DragSelect({
        multiSelectKeys: ['ctrlKey'],
        area:zoomDivArr[sobjIndex],
        onDragMove: function(e){

          var selection = zoomdsArr[sobjIndex].getSelection();

          //only do computations if there selection array isn't empty
          if(selection.length>0){
            var lastEltID = selection[selection.length-1].id;
            var obj = getObjectByValue(seqObjArr[sobjIndex], lastEltID);

            updateCurrSelection('endIndex', obj, sobjIndex);
          }
        },
        onDragStart: function(e){
          var selection = zoomdsArr[sobjIndex].getSelection();
          //only do computations if there selection array isn't empty
          if(selection.length>0){
            var lastEltID = selection[selection.length-1].id;
            //console.log("lastELt: "+lastElt);
            var obj = getObjectByValue(seqObjArr[sobjIndex], lastEltID);

            updateCurrSelection('startIndex', obj, sobjIndex);
          }


        },
        //ensure that select/unselect actions are mirrored in both primary seq div and zoom div
        onElementSelect: function(item){
          mirror(item,'select', sobjIndex);
        },
        onElementUnselect: function(item){
          mirror(item,"unselect", sobjIndex);
        },
        callback: function(){
          var selection = dsArr[sobjIndex].getSelection();
          //DEMO
          //console.log(selection);

          if(selection.length==0){
            updateCurrSelection('startIndex',null, sobjIndex);
            updateCurrSelection('endIndex',null, sobjIndex);
          }
          calibrateDisp(sobjIndex);
          updateSelDisplay(sobjIndex);
        }
        //,selectables: document.getElementsByClassName('res')
      });
      //add to arrays
      dsArr[sobjIndex] = ds;
      zoomdsArr[sobjIndex] = zoomds;

      //widgetContainerArr[sobjIndex].style.position = 'absolute';
  }



/**************************************************************************
  HELPER FUNTIONS
  *************************************************************************/

/**
 * helper function for mirroring selection/unselection between primary sequence div and zoom div
 * @param  {[DOM Node]} item        [HTML node to be mirrored (template)]
 * @param  {String} type            [type of action - select or unselect]
 * @param  {Number} sobjIndex       [sobj Index]
* @example
 */
function mirror(item,type, sobjIndex){
  var zoomSel = zoomdsArr[sobjIndex].getSelection();
  var mainSel = dsArr[sobjIndex].getSelection();

  //SUBJECT TO CHANGE (depends on ID)
  var regex = /_[^_]*/;
  equivID = regex.exec(item.id)[0];
  //DEMO
  //console.log(equivID);
  if(type == "unselect"){
    dsArr[sobjIndex].removeSelection(document.getElementById(equivID));
    if(document.getElementsByClassName('zoomDiv')[sobjIndex].childNodes.length > 1){
      zoomdsArr[sobjIndex].removeSelection(document.getElementById(equivID+'_zoomed'));
    }
  }
  else if(type =="select"){
    dsArr[sobjIndex].addSelection(document.getElementById(equivID));
    if(document.getElementsByClassName('zoomDiv')[sobjIndex].childNodes.length > 1){
      zoomdsArr[sobjIndex].addSelection(document.getElementById(equivID+'_zoomed'));
    }
  }
}

/**
 * [Purpose: Adjust innerText of Sequence Feedback box to show current Selection]
 * @param  {String} spanClass [name of span class ('startIndex' or 'endIndex')]
 * @param  {Object} object    [object defined in initialize() function]
 * @param  {Number} sobjIndex [sobj Index]
 */
function updateCurrSelection(spanClass, object, sobjIndex){
  var str = "";
  if(object != null){
    str = object.sasAtom.getAtom()[object.seqObjArrIndex].toString();
  }
  document.getElementsByClassName(spanClass)[sobjIndex].innerText = str;
}

/**
 * PURPOSE: Adjust HTML of the Selection range Div in the feedback Box (displays subarrays of selections)
 * @param  {Number} sobjIndex [sobj Index]
 */
function updateSelDisplay(sobjIndex){
  //add display for SELECTION (split into contiguous arrays)
  var len = arrDisp.length;
  //clear children first
  while (seqSelRangeDivArr[sobjIndex].firstChild) {
    seqSelRangeDivArr[sobjIndex].removeChild(seqSelRangeDivArr[sobjIndex].firstChild);
  }

  if(len>0){

    for(var i=0;i<len;i++){
      //initialize 'from' text
      var selspan = document.createElement('span');
      var subArray = arrDisp[i];
      var text = (subArray[0]).toString();

      //if subArray has more than one element, initialize colon part and 'to' part
      if(subArray.length>1){

        //additional part (intermediate and end)
        var mid = ' - ';
        var toText = (subArray[subArray.length-1]).toString();
        text+=mid;
        text+=toText;

      }
      var textNode = document.createTextNode(text);
      selspan.appendChild(textNode);
      selspan.classList.add('subArray');
      seqSelRangeDivArr[sobjIndex].appendChild(selspan);

    }
  }
}
/**
 * PURPOSE: helper method for clearing selection (making selection array zero, removing DOM children elements)
 * @param  {Number} sobjIndex [sobj Index]
 */
function clearAllSelection(sobjIndex){
  dsArr[sobjIndex].clearSelection();
  $('.ds-selected').remove();
  arrDisp.length=0;
  updateSelDisplay(sobjIndex);
  updateCurrSelection('startIndex',null,sobjIndex);
  updateCurrSelection('endIndex',null,sobjIndex);

}
/**
 * PURPOSE: split selection array into consecutive subArrays; called when selection is made
 * @param  {Number} sobjIndex [sobj Index]
 */
function calibrateDisp(sobjIndex){
  //console.log(sobjIndex);
  objArrKeyIndex = -1;
  //reset array
  arrDisp=[];


  var selection = dsArr[sobjIndex].getSelection();
  var len = selection.length;
  var currKey;
  var prevKey;
  var arrSorted = [];
  var subArray = [];
  var arrDispIndex = 0;

  //1. sort Array
  for(var i=0; i<len;i++){
    currKey = getObjectByValue(seqObjArr[sobjIndex], dsArr[sobjIndex].getSelection()[i].id).seqObjArrIndex;
    //keys are zero-indexed so add 1 to make compatible with atom numbering
    arrSorted.push(currKey + 1);
  }
  arrSorted.sort(function (a, b) {  return a - b;  });
  //2. update array
  for(var i=0; i<len;i++){
    //for the first element only, initialize subArray
    if(i==0){
      currKey = arrSorted[0];
      prevKey = currKey;
      subArray.push(currKey);
      arrDisp.push(subArray);
    }
    //for all other elements, compute logic for currKey and prevKey (inapplicable to first elt)
    else{
      currKey = arrSorted[i];
      prevKey = arrSorted[i-1];
      //check if contiguous
      if(prevKey == (currKey - 1)){
        arrDisp[arrDispIndex].push(currKey);
      }
      else{
        //if not contiguous, create new subArray
        subArray = [];
        subArray.push(currKey);
        arrDisp.push(subArray);
        arrDispIndex++;
      }
    }
  }
  //DEMO
  // console.log(arrDisp);
}
/**
 * Helper function for retrieving a key by its value
 * @param  {Object} arr   [There is no official JavaScript type for an Array so it is technically an Object]
 * @param  {String,Number,Boolean} value [value to search with]
 * @return {String,Number,Boolean}       [matched key to value]
 */
function getKeyByValue(arr, value) {
  for(var i=0, iLen = arr.length; i<iLen;i++){
    for (key in arr[i]){
      if(arr[i][key] == value){return key;}
    }

  }
}
/**
 * Helper function for retrieving an object by its value (key:value), see structure of seqObj defined in Initialize() to understand why this may be useful
 * @param  {Object} arr   [There is no official JavaScript type for an Array so it is technically an Object]
 * @param  {String,Number,Boolean} value [value to search with]
 * @return {Object}       [matched object]
 */
function getObjectByValue(arr, value) {
  for(var i=0, iLen = arr.length; i<iLen;i++){
    for (key in arr[i]){
      if(arr[i][key] == value){return arr[i];}
    }

  }
}

/**
 * Function for toggling on the displayLocator box
 * @param  {String} loc       [string to fill locator box with]
 * @param  {Number} sobjIndex [sobj Index]
 */
  function displayLocator(loc, sobjIndex){
    locatorDivArr[sobjIndex].style.display='block';
    locatorBoxArr[sobjIndex].innerText=loc;
  }
/**
 * Function for geometrically computing (sequence) index based on position of mouse
 * @param  {Number} x         [x coordinate of mouse]
 * @param  {Number} sobjIndex [sobj Index]
 * @return {Number}           ["equivalent" sequence index]
 */
  function getIndexByWidth(x, sobjIndex){
    return Math.ceil(x/eltWidthArr[sobjIndex]);
  }


  /**
   * Fills zoomDiv with HTML elements; takes in value in locatorBox to display a range
   * @param  {Number} index     [sequence index]
   * @param  {Number} sobjIndex [sobj Index]
   */
  function populateZoomDiv(index, sobjIndex){
    //clear children except selector box
    while(zoomDivArr[sobjIndex].children.length>1){
      zoomDivArr[sobjIndex].removeChild(zoomDivArr[sobjIndex].lastChild);
    }
    var zoomRangeLeft;
    var zoomRangeWidth;

    // MAKE MODULAR (values in parentheses can be variadic in the future)
    var lorange = index - (5) - 1;
    if(index <= (5)){
      lorange = 0;
    }
    var hirange = index + (5);
    if(hirange > seqObjArr[sobjIndex].length){
      hirange = seqObjArr[sobjIndex].length;
    }
    for(var i = lorange; i<hirange;i++){
      var obj = getObjectByValue(seqObjArr[sobjIndex],i);
      var atomName = obj.sasAtom.getName()[obj.seqObjArrIndex];
      var atomNum = obj.sasAtom.getAtom()[obj.seqObjArrIndex];


      var resZoom = document.createElement('span');
      resZoom.className = 'res';
      resZoom.innerText = atomName + '\n' + atomNum;
      var id = obj.dom_id;
      resZoom.id = id+'_zoomed';
      resZoom.style.height = '30px';
      resZoom.style.width = '30px';
      resZoom.style.fontSize = '14px';
      resZoom.style.margin = '5px';
      resZoom.style.border = '1px solid black';
      zoomDivArr[sobjIndex].appendChild(resZoom);
      zoomdsArr[sobjIndex].addSelectables(resZoom);

      //mirror in zoomDiv because these new spans are called after selection in primary seq div
      var mirrorItem = document.getElementById(id);
      //check if selected
      if(mirrorItem.className.includes('ds-selected')){
        mirror(mirrorItem,"select", sobjIndex);
      }
      //HTML stuff for marking edges of a zoom range
      if(i==lorange){
        mirrorItem.classList.add('zoomed-lefthook');
        zoomRangeLeft = mirrorItem.offsetLeft;
      }
      else if(i==hirange-1){
        mirrorItem.classList.add('zoomed-righthook');
      }
      // else{
      //   mirrorItem.classList.add('zoomed-middle');
      // }

    }
  }


/**
 * Helper function to get an element's exact position (if nested in container divs)
 * CREDIT: https://www.kirupa.com/html5/get_element_position_using_javascript.htm
 * @param  {HTML Node} el [HTML node of interest]
 * @return {Object}    [object with x and y coordinates]
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



} );//end of jQuery.ready()
