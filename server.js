var express = require('express')
var app = express();
var mongoose = require('mongoose');
 
// mongoose models
require('./models');
 
// routes
var routes = require('./routes');
 
// mongodb URI
var uristring =  
process.env.MONGOLAB_URI || 
process.env.MONGOHQ_URI || 
'mongodb://localhost/video-annotator';
 
// connect to db
mongoose.connect(uristring);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log("Mongoose started!");
});
 
// express config
//app.use(app.router);
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
app.use(express.static(__dirname + '/app'));
 
// routes
app.get('/', routes.index);
 
// start server
var server = app.listen(process.env.PORT || 8000);
console.log('Express server started on port %s', server.address().port);
