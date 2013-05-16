#!/usr/bin/env node

var infront = require('../index')
  , connect = require('connect')
  , path = require('path')

var app = connect();

var rootPath = path.resolve(process.env.PWD, process.argv[2] || '');
var port = 3000;

app.use(connect.logger('dev'));
app.use(infront(rootPath));

app.listen(port, function() {
	console.log('Webserver started at this path (' + rootPath + ') on port ' + port + '. Visit http://localhost:3000/');
});