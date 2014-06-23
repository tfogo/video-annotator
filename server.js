var express = require('express')
var app = express();
var mongoose = require('mongoose');

// config
var config = require('./config');

// mongoose models
require('./models');
 
// routes
var routes = require('./routes');
 
// mongodb URI
var uristring = config.db;

// connect to db
mongoose.connect(uristring);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log("Mongoose started!");
});
 
// express config
// app.use(app.router);
// app.use(require('connect-livereload')());
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/.tmp'));
app.set('views', __dirname + '/app/views');

// routes
app.get('/', routes.index);
app.get('/test', routes.test);

// start server
var server = app.listen(process.env.PORT || 9000, function() {
    console.log('Express server listening on port %s', server.address().port);
});
