var express = require('express')
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var passport = require('passport');

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
 
// express config

//cookieParser should be above session
app.use(require('cookie-parser')());

//express/mongo session storage
app.use(session({
    secret: 'MEAN',
    store: new mongoStore({
        db: db.db,
        collection: 'sessions'
    })
}));

app.use(flash());
app.use(bodyParser());
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/.tmp'));
app.use(express.static(config.videoDir));
app.set('views', __dirname + '/app/views');

require('./controllers/users')(passport);

app.use(passport.initialize());
app.use(passport.session());

// routes
require('./controllers/routes')(app, passport);

// start server
var server = app.listen(process.env.PORT || 9000, function() {
    console.log('Express server listening on port %s', server.address().port);
});
