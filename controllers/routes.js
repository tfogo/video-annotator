var mongoose = require('mongoose');
var fs = require('fs');
var config = require('../config');

var tags = require('./tags');

var videos = fs.readdirSync(config.videoDir);
var tagnames = JSON.parse(fs.readFileSync('tags.json'));

var vidNumber = 0;

module.exports = function(app) {

    
    // app.get('/tags', podcasts.all);
    // app.post('/tags', authorization.requiresLogin, podcasts.create);
    // app.get('/tags/:tagId', podcasts.show);
    // app.put('/tags/:tagId', authorization.requiresLogin, hasAuthorization, podcasts.update);
    // app.del('/tags/tagId', authorization.requiresLogin, hasAuthorization, podcasts.destroy);

    app.get('/tags', tags.all);
    app.post('/tags', tags.create);
    app.get('/tags/:tagId', tags.show);
    app.put('/tags/:tagId', tags.update);
    app.del('/tags/tagId', tags.destroy);

    app.param('tagId', tags.tag);

    app.get('/', function(req, res) {
        res.render('index', {videoName: videos[vidNumber++ % 4]}); 
    });

    app.post('/data', function(req, res) {
        console.log(req.body);
        res.jsonp({});
    });

    app.get('/tagnames', function(req, res) {
        res.jsonp(tagnames);
    });

}
