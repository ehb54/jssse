//NodeJS core module definitions
var http = require('http');
var fs = require('fs');
var readline = require('readline');
var url = require('url');
var hostname = '127.0.0.1';
var port = 3000;

//load in html
// fs.readFile('index.html',function(err, html){
//   if(err){throw err;}
// });

//start server
var server = http.createServer(function(req, res){
  //boilerplate stuff
  res.statusCode = 200;
  var pathname = url.parse(req.url).pathname;
  console.log("Request for " + pathname + " received.");

  res.writeHead(200);

  //sync. read files?
  // if(pathname == "/") {
  //     html = fs.readFileSync("index.html", "utf8");
  //     res.write(html);
  // } else if (pathname == "/javascript.js") {
  //     script = fs.readFileSync("javascript.js", "utf8");
  //     res.write(script);
  // }
  // else if (pathname == "/style.css") {
  //     style = fs.readFileSync("style.css", "utf8");
  //     res.write(style);
  // }


  var input = fs.createReadStream('1AA-NoEND.pdb')
  var rl = readline.createInterface({
    input: input,
    //output:process.stdout
    terminal:false
  });
  //readline
  rl.on('line',function(line){
    console.log("this is a line => " + line);
  });
  //async read read files
  fs.readFile('1AA-NoEND.pdb', 'utf8',function(err, data){
    if(err){throw err;}
    console.log(data);
  });

  res.end();
  rl.close();
});
server.listen(port,hostname,function(){
  console.log('Server started on port ' + port);
});
