window.onload = function(){


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
        console.log(results);
        return results;
    });
}
// sample usage
function handleRead(e){
  var files = e.target.files;
  var fileArr = [];
  for(var i = 0,f;f=files[i];i++){
    fileArr[i]=f;
  }
  console.log(fileArr);
  readmultifiles(fileArr);
}

document.getElementById('files').addEventListener('change', handleRead, false);
}
