// // the dragSelect is constrained within the red border container in the middle of the screen. You can scroll the container
// $( function() {
//   var ds = new DragSelect({
//     selectables: document.getElementsByClassName('item'),
//     area: document.getElementById('container1'),
//     onElementSelect: function(item){
//       mirror(item,'select');
//     },
//     onElementUnselect: function(item){
//       mirror(item,"unselect");
//     }
//   });
//
//   var globalArr = document.getElementsByClassName('item');
//   //ds.addSelectables(document.getElementsByClassName('newSpan'));
//   var ds2 = new DragSelect({
//     selectables: document.getElementsByClassName('newSpan'),
//     area: document.getElementById('container2'),
//     callback: function(){
//
//     },
//     onElementSelect: function(item){
//       mirror(item,'select');
//     },
//     onElementUnselect: function(item){
//       mirror(item,"unselect");
//     }
//   });
//   function mirror(item,type){
//     var selection2 = ds2.getSelection();
//     var selection = ds.getSelection();
//     //console.log(item.parentNode);
//     var equivID = item.id;
//     if(item.parentNode.id == 'container2'){
//       var regex = /(\w{3}\d+)(\w+)/;
//       equivID = regex.exec(item.id)[1];
//     }
//
//
//     if(type == "unselect"){
//       ds.removeSelection(document.getElementById(equivID));
//       if(document.getElementById('container2').childNodes != null){
//         ds2.removeSelection(document.getElementById(equivID+'copy'));
//       }
//     }
//     else if(type =="select"){
//       ds.addSelection(document.getElementById(equivID));
//       if(document.getElementById('container2').childNodes != null){
//         ds2.addSelection(document.getElementById(equivID+'copy'));
//       }
//     }
//   }
// });

var temp = 1;
$(function(){
  var dsArr = [];
  var widgetIndex = 0;
  function init(){
    var ds = new DragSelect({
      selectables: document.getElementById('container1').querySelectorAll('.item'),
      area: document.getElementById('container1'),
      callback: function(){
        console.log(ds.getSelection());
      }
    });
    var ds2 = new DragSelect({
      selectables: document.getElementById('container2').querySelectorAll('.item'),
      area: document.getElementById('container2'),
      callback: function(){
        console.log(ds2.getSelection());
      }
    });
    dsArr.push(ds);
    dsArr.push(ds2);
  }
  init();
  document.getElementById('ds1').addEventListener('click',function(e){
    console.log(dsArr[widgetIndex].getSelection());
  });
  document.getElementById('ds2').addEventListener('click',function(e){
    console.log(dsArr[1].getSelection());
  });
  function limitedScope(arg) {
    document.getElementById('testButton').addEventListener('click', function(e){
      // if(widgetIndex == 0){
      //   widgetIndex = 1;
      // }
      // else{
      //   widgetIndex = 0;
      // }
      console.log(dsArr[temp].getSelection());
      document.getElementById('ds'+arg).focus();
      console.log(document.querySelectorAll("[id="+'container'+temp+"]"));

    });
    document.getElementById('container2').addEventListener('mousemove',function(e){
      //console.log(e.pageX);
    });
  }
  limitedScope(2);
});
