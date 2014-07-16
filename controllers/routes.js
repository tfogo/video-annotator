var mongoose = require('mongoose');
var fs = require('fs');
var config = require('../config');


var tags = require('./tags');

var videos = fs.readdirSync(config.videoDir);
var tagnames = JSON.parse(fs.readFileSync('tags.json'));

var vidNumber = 0;

module.exports = function(app, passport) {

    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/failure',
        failureFlash: true
    }), function(req, res) {
        res.redirect('/watch?v=' + videos[vidNumber++ % 30]);
    });
    
    app.get('/tags', tags.all);
    app.post('/tags', tags.create);
    app.get('/tags/:tagId', tags.show);
    app.put('/tags/:tagId', tags.update);
    app.delete('/tags/:tagId', tags.destroy);

    app.param('tagId', tags.tag);

    app.get('/', function(req, res) {
        if(!!req.user) {
            res.redirect('/watch?v=' + videos[vidNumber++ % 30]);
        } else {
            res.render('login'); 
        }
    });

    app.get('/watch', function(req, res) {
        console.log('WAHEY');
        res.render('body', {videoName: req.query['v'], username: req.user.username}); 
    });

    app.post('/data', function(req, res) {
        console.log(req.body);
        res.jsonp({});
    });

    app.get('/tagnames', function(req, res) {
        res.jsonp(tagnames);
    });

}
