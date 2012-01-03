var io = require('socket.io').listen(5000),
	chatlogic = require('./chatlogic.js'),
	static = require('node-static');

io.sockets.on('connection', chatlogic);

// http server

//
// Create a node-static server instance to serve the './clients' folder
//
var file = new(static.Server)('./');

require('http').createServer(function (request, response) {
	request.addListener('end', function () {
		// Serve the files to the client
		file.serve(request, response);
	});
}).listen(8080);
