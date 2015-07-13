var async = require('async');
var path = require('path');
var http = require('https');
var fs = require('fs');

var filesDestPath = path.join(__dirname, 'ext');
var filesBaseUrl = 'https://raw.githubusercontent.com/moander/aspnetHome/dev/';

var files = [
	"dnvm.cmd",
	"dnvm.ps1",
	"dnvm.sh"
];

try {
	fs.mkdirSync(filesDestPath);
} catch (e){ 
	
}

async.each(files, function (name, callback) {
	var url = filesBaseUrl + name;
	var dest = path.join(filesDestPath, name);
	dl(url, dest, callback);		
}, function (err) {
	if (err) throw err;
	console.log('success');
});

function dl(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
}
