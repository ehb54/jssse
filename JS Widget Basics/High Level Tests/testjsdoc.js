var Obj = require('./module1');
/**
 * module that uses module1
 * @module testJSDOC
 */
/**
 * does something with obj defined in module1
 * @param  {module:Obj~obj} object obj defined in module1
 */
function doSomething(object){
  console.log(object.greet);
}
/**
 * newObj
 * @type {module:Obj~obj}
 */
var newObj = Obj.obj;
