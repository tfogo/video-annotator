var mongoose = require('mongoose');
var fs = require('fs');
var config = require('../config');
var Video = mongoose.model('Video');


var tags = require('./tags');

var videos = fs.readdirSync(config.videoDir);
var tagnames = JSON.parse(fs.readFileSync('tags.json'));

var vidNumber = 0;

var findVid = function(user) {
    
    // Video.find({users: {$ne: user.username}}).sort(numberOfUsers).limit(1), function(err, vid) {
    //     console.log(vid);
    // });
    
}

Video.remove({});
videos.forEach(function(vidname) {
    var vid = new Video({name: vidname});
    vid.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log(vid);
        }
    });
});

module.exports = function(app, passport) {

    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/failure',
        failureFlash: true
    }), function(req, res) {
        Video.find({users: {$ne: req.user.username}}).sort('numberOfUsers').limit(1).exec(function(err, vid) {
                videoObj = vid[0]
                console.log(videoObj);
                videoObj.numberOfUsers++;
                videoObj.users.push(req.user.username);
                console.log(videoObj);
                videoObj.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                }); 
                res.redirect('/watch?v=' + videoObj.name);
            });
    });
    
    app.get('/tags', tags.all);
    app.post('/tags', tags.create);
    app.get('/tags/:tagId', tags.show);
    app.put('/tags/:tagId', tags.update);
    app.del('/tags/:tagId', tags.destroy);

    app.param('tagId', tags.tag);

    app.get('/', function(req, res) {
        if(!!req.user) {
            Video.find({users: {$ne: req.user.username}}).sort('numberOfUsers').limit(1).exec(function(err, vid) {
                videoObj = vid[0]
                console.log(videoObj);
                videoObj.numberOfUsers++;
                videoObj.users.push(req.user.username);
                console.log(videoObj);
                videoObj.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                }); 
                res.redirect('/watch?v=' + videoObj.name);
            });
            //res.redirect('/watch?v=' + videos[vidNumber++ % videos.length]);
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

    app.get('/popdb', function(req, res) {
        Video.find({}).remove();
        videos.forEach(function(vidname) {
            var vid = new Video({name: vidname});
            vid.save(function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(vid);
                }
            });
        });
        res.jsonp({videos: true});
    });
}
