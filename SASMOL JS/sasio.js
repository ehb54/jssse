
window.onload = function(){
  //handling local files
  function handleFileSelect(e) {
    var files = e.target.files; // FileList object (list of File objects)
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function (evt){
      //grabs info
      var info = evt.target.result;
      //create jspdb object
      //var obj3 = jspdb.create('fakediv',{});
      console.log(info);
      //jspdb.load(obj3, info, function(err){if(err){throw err;}});
    }
    reader.readAsText(file);


  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);
}



//NodeJS core module definitions
var http = require('http');
var fs = require('fs');
var url = require('url');
var hostname = '127.0.0.1';
var port = 3000;

//load in html
fs.readFile('sasIndex.html',function(err, html){
  if(err){throw err;}
});

//start server
var server = http.createServer(function(req, res){
  //boilerplate stuff
  res.statusCode = 200;
  var pathname = url.parse(req.url).pathname;
  console.log("Request for " + pathname + " received.");

  res.writeHead(200);

  //sync. read files?
  if(pathname == "/") {
      html = fs.readFileSync("index.html", "utf8");
      res.write(html);
  } else if (pathname == "/sasio.js") {
      script = fs.readFileSync("sasio.js", "utf8");
      res.write(script);
  }

  //async read read files
  fs.readFile('test.txt', 'utf8',function(err, data){
    if(err){throw err;}
    console.log(data);
  });


  res.end();
});
server.listen(port,hostname,function(){
  console.log('Server started on port ' + port);
});
