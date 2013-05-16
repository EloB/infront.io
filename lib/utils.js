// Module dependencies.
var url = require('url');

// Patterns
var PATTERN_FILENAME = /[^/]*$/
  , PATTERN_TRIM_SLASHES = /(^\/|\/$)/g
  , PATTERN_MULTIPLE_SLASHES = /\/+/g
  , PATTERN_PARSE_FILE = /([^/]+?)(?:-(\d+.\d+\.\d+))?(?:\.(.*?))?$/;

// Exports
exports.getRequestFileName = function(requestUrl) {
	var location = url.parse(requestUrl);
	
	return location.pathname.match(PATTERN_FILENAME).toString();
};

exports.getRequestDirName = function(requestUrl) {
	var location = url.parse(requestUrl);
	
	var pathName = location.pathname.replace(PATTERN_FILENAME, '');
	
	return '/' + pathName.replace(PATTERN_MULTIPLE_SLASHES, '/').replace(PATTERN_TRIM_SLASHES, '');
};

exports.parse = function(fileName) {
	var matches;
	
	if(matches = fileName.match(PATTERN_PARSE_FILE)) {
		return new File(matches[1], matches[2], matches[3]);
	} else {
		return false;
	}
};

var File = exports.File = function(name, version, extension) {
	this.name = name || '';
	this.version = version || null;
	this.extension = extension || null;
};

File.prototype.getShortName = function() {
	return this.name + (this.extension ? '.' + this.extension : '');
};

File.prototype.getFullName = function() {
	return this.name + (this.version ? '-' + this.version : '') + (this.extension ? '.' + this.extension : '');
};

File.prototype.toString = function() {
	return this.getFullName();
};