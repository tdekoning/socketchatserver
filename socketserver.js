var io = require('socket.io').listen(5000),
	people = [];

io.sockets.on('connection', function (socket) {
	// Create a new Person object for the given socket
	people.push( new Person(socket) );

	/*
	 * Joinlistener, adds additional data to the current person and tells everyone that he/she joined
	 */
	socket.on('join', function( data ) {
		var person = people[findIndexBySocket( socket )];
		person.name = data.name;

		notifyEveryone( {message: person.name + ' has joined', name: 'System'} );
	});

	/*
	 * Messagelistener, distributes the given message to all connected people
	 */
	socket.on('message', function( messagedata ) {
		var person = people[findIndexBySocket( socket )];

		notifyEveryone( {message: messagedata.message, name: person.name} );
	});

	/*
	 * Disconnect logic
	 */
	socket.on('disconnect',function() {
		// To prevent incorrect data in our people array, we need to remove the current person from the array
		var index = findIndexBySocket( socket );
		people.splice(index, 1);
	});

	/*
	 * Finds the index of the person with the given socket
	 */
	function findIndexBySocket( socket ) {
		for( var i = 0; i < people.length; i++ ) {
			if( people[i].socket == socket ) {
				return i;
			}
		}
		return null;
	}

	/*
	 * Sends the given message to all connected people
	 */
	function notifyEveryone( message ) {
		for( var i = 0; i < people.length; i++ ) {
			people[i].socket.emit('message', message);
		}
	}

	/*
	 * The object containing all the data required for chatting
	 */
	function Person( socket ) {
		this.socket = socket;
		this.name = 'Anonymous';
	}
});


// http server
var static = require('node-static');

//
// Create a node-static server instance to serve the './clients' folder
//
var file = new(static.Server)('./');

require('http').createServer(function (request, response) {
	request.addListener('end', function () {
		//
		// Serve files!
		//
		file.serve(request, response);
	});
}).listen(8080);
