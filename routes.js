var mongoose = require('mongoose');
var fs = require('fs');
var config = require('./config');
var Video = mongoose.model('Video');

var videos = fs.readdirSync(config.videoDir);
console.log(videos);
// var videos = fs.readdir(config.videoDir, function(err, files) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(files);
//     }
// });

var vidNumber = 0;

exports.index =  function(req, res) {
    res.render('index', {videoName: videos[vidNumber++ % 4]}); 
};

exports.data = function(req, res) {
    console.log(req.body);
    res.jsonp({});
};
