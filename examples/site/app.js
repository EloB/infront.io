// Module dependencies.
var connect = require('connect');

// Application
var app = connect();

app.use(connect.logger('dev'));
app.use(connect.favicon());
app.use(connect.static('public'));

app.listen(3000);