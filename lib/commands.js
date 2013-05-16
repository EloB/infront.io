// Module dependencies.
var request = require('request');

// Exports
exports.search = function(name, callback) {
	request({
		url: 'http://registry.infront.io/' + name,
		json: true
	}, function(err, res, body) {
		callback(err, body);
	});
};