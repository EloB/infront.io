// Module dependencies.
var request = require('request');

// Patterns
var PATTERN_GITHUB = /^(https:)\/\/(github.com)\/([^/]+\/[^/]+)\/(blob\/master)\/(.*)/
  , PATTERN_CDN = /\{\{version\}\}/;

// Exports
exports.github = function(url, version) {
	version || (version = 'master');
	
	var downloadableUrl = url.replace(PATTERN_GITHUB, '$1//raw.$2/$3/' + version + '/$5');
	
	return request(downloadableUrl);
};

exports.cdn = function(url, version) {
	var downloadableUrl = url.replace(PATTERN_CDN, function(match) {
		return (version ? '-' + version : '');
	});
	
	return request(downloadableUrl);
};