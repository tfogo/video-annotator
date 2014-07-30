var mongoose = require('mongoose');

// config
var config = require('./config');
 
// mongodb URI
var uristring = config.db;

// connect to db
mongoose.connect(uristring);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log("Mongoose started!");
});

// mongoose models
require('./models');

var Video = mongoose.model('Video');
var Tag = mongoose.model('Tag');
var User = mongoose.model('User');

rankings = {};
for (var i = 0; i < 30; i++) {
    rankings['p'+i] = 0;
}

Tag.find({}, function(err, tag){
    tag.forEach(function(){
	console.log(tag[1]);
	rankings[tag.username]++;
	console.log(tag.username);
    });
    var sortable = [];
    for (var user in rankings) {
        sortable.push([user, rankings[user]]);
    }
    sortable.sort(function(a, b) {return a[1] - b[1]});
    console.log(sortable);
});
