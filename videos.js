'use strict';

var mongoose = require('mongoose'),
    Video = mongoose.model('Video'),
    _ = require('lodash');
var querystring = require("querystring");
var mime = require('mime');

/**
 * Find video by id
 */
exports.video = function(req, res, next, id) {
    Video.load(id, function(err, video) {
        if (err) return next(err);
        if (!video) return next(new Error('Failed to load video ' + id));
        req.video = video;
        console.log(video);
        next();
    });
};

/**
 * Create a video
 */
exports.create = function(req, response) {
   
};

/**
 * Update a video
 */
exports.update = function(req, res) {
    var video = req.video;

    video = _.extend(video, req.body);

    video.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                video: video
            });
        } else {
            res.jsonp(video);
        }
    });
};

/**
 * Delete an video
 */
exports.destroy = function(req, res) {
    var video = req.video;

    video.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                video: video
            });
        } else {
            res.jsonp(video);
        }
    });
};

/**
 * Show a video
 */
exports.show = function(req, res) {
    res.jsonp(req.video);
};

/**
 * List of Videos
 */
exports.all = function(req, res) {
    Video.find(function(err, videos) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(videos);
        }
    });
};

