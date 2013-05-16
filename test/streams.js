var should = require('should')
  , stream = require('stream')
  , request = require('request');

describe('streams', function() {
	var streams = require('../index').streams
	  , buffers = [];
	
	function bufferInput(data) {
		buffers.push(data);
	}
	
	function bufferValidate(body, done) {
		return function() {
			Buffer.concat(buffers).toString().should.eql(body);
			
			buffers = [];
			
			done();
		};
	};
	
	describe('.github', function() {
		var path = 'https://github.com/documentcloud/backbone/blob/master/backbone.js';
		
		it('should download a specific file', function(done) {
			request('https://raw.github.com/documentcloud/backbone/master/backbone.js', function(err, response, body) {
				if(err) return done(err);
				
				streams.github(path, null)
				.on('data', bufferInput)
				.on('end', bufferValidate(body, done));
			});
		});
		
		it('should be able to download a specific version of the file', function(done) {
			request('https://raw.github.com/documentcloud/backbone/0.9.0/backbone.js', function(err, response, body) {
				if(err) return done(err);
				
				streams.github(path, '0.9.0')
				.on('data', bufferInput)
				.on('end', bufferValidate(body, done));
			});
		});
	});
	
	describe('.cdn', function() {
		var path = 'http://code.jquery.com/jquery{{version}}.js';
		
		it('should download a specific file', function(done) {
			request('http://code.jquery.com/jquery.js', function(err, response, body) {
				if(err) return done(err);
				
				streams.cdn(path, null)
				.on('data', bufferInput)
				.on('end', bufferValidate(body, done));
			});
		});
		
		it('should be able to download a specific version of the file', function(done) {
			request('http://code.jquery.com/jquery-1.9.0.js', function(err, response, body) {
				if(err) return done(err);
				
				streams.cdn(path, '1.9.0')
				.on('data', bufferInput)
				.on('end', bufferValidate(body, done));
			});
		});
	});
});