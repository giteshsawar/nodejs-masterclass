/*
 * Primary file for API
 *
 */

// Dependencies
var url = require('url');
var http = require('http');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config/config');
var fs = require('fs');

// var _data = require('./lib/data');

// _data.remove('test', 'newfile', function(err) {
// 	console.log('error occured while creating file', err);
// });

// Configure the server to respond to all requests with a string
var server = http.createServer(function(req, res) {

	// Parse the url
	var parsedUrl = url.parse(req.url, true);


	// Get the path
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g, '');

	// Get the query string as an object
	var queryStringObject = parsedUrl.query;

	// Get the http method
	var method = req.method.toLowerCase();

	// Ger the headers as an object
	var headers = req.headers;

	// Get the payload, if any
	var decoder = new StringDecoder('utf-8');
	var buffer = '';

	req.on('data', function(data) {
		// body...
		buffer += decoder.write(data);
	})

	req.on('end', function() {

		buffer += decoder.end();

		// Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
		var activeHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        var data = {
        	'headers': headers,
        	'method': method,
        	'trimmedPath': trimmedPath,
        	'queryStringObject': queryStringObject,
        	'payload': buffer
        };

        // Route the request to the handler specified in the router
        activeHandler(data, function(statusCode, payload) {

			// Use the status code returned from the handler, or set the default status code to 200
			statusCode = typeof(statusCode) == 'number' ? statusCode :200;

			// Use the payload returned from the handler, or set the default payload to an empty object
			payload = typeof(payload) == 'object' ? payload : {};

			// Convert the payload to a string
			var payloadString = JSON.stringify(payload);

			// Return the response
			// Send the response
			// set the response headers
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

			// Log the request/response
			console.log("Returning this response: at port"+ config.port + 'on'+config.name + 'environment');

		});
	});
});

// Start the server
server.listen(config.port, function() {
  console.log("server listening on port 3000");
});

// Define all the handlers
var handlers = {};

// Sample handler
handlers.home = function (data, callback) {
	// body...
	callback(406, {'name': 'home'});
};

// Not found handler
handlers.notFound = function(data, callback) {
	callback(404);
};

// Define the request router
var router = {
	'home': handlers.home
};
