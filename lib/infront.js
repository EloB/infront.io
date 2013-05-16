// Module dependencies.
var connect = require('connect')
  , request = require('request')
  , domain = require('domain')
  , mkdirp = require('mkdirp')
  , path = require('path')
  , url = require('url')
  , fs = require('fs');

// Exports
module.exports = exports = infront;

var utils = exports.utils = require('./utils');
var streams = exports.streams = require('./streams');
var commands = exports.commands = require('./commands');

// Infront
function infront(dirname) {
	var app = connect();
	
	app.use(connect.static(dirname));
	app.use(infront.middleware(dirname));
	
	return app;
}

// Middleware
exports.middleware = function middleware(options) {
	var rootPath;
	
	options || (options = {});
	
	if(typeof(options) == 'string') {
		rootPath = fs.realpathSync(options);
	} else {
		rootPath = fs.realpathSync(options.rootPath);
	}
	
	return function(req, res, next) {
		var d, file;
		
		d = domain.create();
		
		d.on('error', function(err) {
			console.log(err);
			
			next();
		});
		
		if(file = utils.parse(req.url)) {
			commands.search(file.getShortName(), d.intercept(function(framework) {
				if(framework.type in streams) {
					var requestDirName = utils.getRequestDirName(req.url)
					  , localDirName = path.join(rootPath, requestDirName);
					
					fs.exists(localDirName, function(exist) {
						var download = d.bind(function() {
							var filePath = path.join(localDirName, file.toString())
							  , fileStream = fs.createWriteStream(filePath)
							  , downloadStream = streams[framework.type](framework.url, file.version);
							
							d.add(fileStream);
							d.add(downloadStream);
							
							downloadStream.pipe(fileStream);
							downloadStream.pipe(res);
						});
						
						if(exist) {
							download();
						} else {
							mkdirp(localDirName, d.intercept(download));
						}
					});
				} else {
					next();
				}
			}));
		} else {
			next();
		}
	};
};