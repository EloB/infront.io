var should = require('should')
  , connect = require('connect')
  , request = require('supertest')
  , path = require('path')
  , fs = require('fs');

describe('infront', function() {
	var infront = require('../index')
	  , dirnameSandbox = path.join(__dirname, 'sandbox')
	  , indexContent = 'This is a test file';
	
	beforeEach(function(done) {
		rmdirRecursive(dirnameSandbox, function() {
			buildSandbox(dirnameSandbox, {
				'index.html': indexContent,
				'js': {
					'init.js': '(function() { alert("Test"); })();'
				},
				'css': {
					'master.css': '* { margin: 0; padding: 0 }'
				}
			}, done);
		});
	});
	
	after(function(done) {
		rmdirRecursive(dirnameSandbox, done);
	});
	
	it('should get the static files from dirname', function(done) {
		var app = infront(dirnameSandbox);
		
		request(app)
		.get('/')
		.expect('Content-Type', /text\/html/)
		.expect(200, indexContent, done);
	});
	
	it('should automatically search registry.infront.io when getting a 404 request and start downloading response url and pipe it to both the request and to the disk', function(done) {
		var app = infront(dirnameSandbox), pathName;
		
		request(app)
		.get(pathName = '/download/backbone.js')
		.expect(200)
		.end(controlResponse(pathName, done));
	});
	
	it('should also be able to download a specific version', function(done) {
		var app = infront(dirnameSandbox), pathName;
		
		request(app)
		.get(pathName = '/download/backbone-0.9.9.js')
		.expect(200)
		.end(controlResponse(pathName, done));
	});
	
	it('should work with cdn', function(done) {
		var app = infront(dirnameSandbox), pathName;
		
		request(app)
		.get(pathName = '/download/jquery.js')
		.expect(200)
		.end(controlResponse(pathName, done));
	});
	
	// Helpers
	function controlResponse(pathName, done) {
		return function(err, res) {
			if(err) return done(err);
			
			res.text.should.be.ok;
			
			var fileName = path.join(dirnameSandbox, pathName);
			
			fs.exists(fileName, function(exist) {
				exist.should.be.true;
				
				fs.readFile(fileName, 'utf8', function(err, content) {
					if(err) return done(err);
					
					content.should.eql(res.text);
					
					done();
				});
			})
		};
	};
	
	function getKeys(obj) {
		var key, result = [];
		
		for(key in obj) if(obj.hasOwnProperty(key)) result.push(key);
		
		return result;
	}
	
	function buildSandbox(dirPath, obj, callback) {
		var keys = getKeys(obj);
		
		fs.mkdir(dirPath, function(err) {
			if(err) return callback(err);
			
			(function eachItem(err) {
				if(err) return callback(err);
				
				if(keys.length == 0) return callback(null);
				
				var key = keys.shift()
				  , item = obj[key]
				  , itemPath = path.join(dirPath, key);
				
				if(typeof(item) == 'string') fs.writeFile(itemPath, item, eachItem);
				else buildSandbox(itemPath, item, eachItem);
			})();
		});
	}
	
	function rmdirRecursive(dirPath, callback) {
		fs.readdir(dirPath, function(err, items) {
			if(err) return callback(err);
			
			(function eachItem(err) {
				if(err) return callback(err);
				
				if(items.length === 0) return fs.rmdir(dirPath, callback);
				
				var item = items.shift()
				  , itemPath = path.join(dirPath, item);
				
				fs.stat(itemPath, function(err, stat) {
					if(err) return callback(err);
					
					if(stat.isDirectory()) rmdirRecursive(itemPath, eachItem);
					else fs.unlink(itemPath, eachItem);
				});
			})();
		});
	};
});