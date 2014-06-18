var mongoose = require('mongoose')
    , Video = mongoose.model('Video');
 
exports.index = function(req, res) {
    res.sendfile('index.html');
};
