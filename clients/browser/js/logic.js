$(document).ready(function() {
    var socket = io.connect('http://localhost:5000');

	socket.on('message', function(data) {
		$('#chatLog').append('<div class="chatmessage">' + data.name + ' zegt: ' + data.message + '</div>');
	});

	$('#message').click(function() {
		// Replace all newlines with real breaks
		var text = $('#text').val().replace(/\n/g, '<br/>');
		socket.emit('message', { message: text } );
	});

	$('#join').click(function() {
		if( $('#nick').val() != undefined ) {
			socket.emit('join', {name: $('#nick').val() });
			$('#message').fadeIn();
			$('#join').fadeOut();
			$('#nick').fadeOut();
		}
	});
});



