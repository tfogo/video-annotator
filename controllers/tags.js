'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Tag = mongoose.model('Tag'),
    _ = require('lodash');

/**
 * Find tag by id
 */
exports.tag = function(req, res, next, id) {
    Tag.load(id, function(err, tag) {
        if (err) return next(err);
        if (!tag) return next(new Error('Failed to load tag ' + id));
        req.tag = tag;
        next();
    });
};

/**
 * Create a tag
 */
exports.create = function(req, res) {
    var tag = new Tag(req.body);
    tag.username = req.user.username;
    tag.dateSubmitted = new Date().getTime();

    tag.save(function(err) {
        if (err) {
            console.log(err);
            return res.send('users/signup', {
                errors: err.errors,
                tag: tag
            });
        } else {
            res.jsonp(tag);
        }
    });
};

/**
 * Update a tag
 */
exports.update = function(req, res) {
    var tag = req.tag;

    tag = _.extend(tag, req.body);

    tag.save(function(err) {
        if (err) {
            console.log(err);
            // return res.send('users/signup', {
            //     errors: err.errors,
            //     tag: tag
            // });
        } else {
            res.jsonp(tag);
        }
    });
};

/**
 * Delete an tag
 */
exports.destroy = function(req, res) {
    var tag = req.tag;
    console.log('delete!');

    tag.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                tag: tag
            });
        } else {
            res.jsonp(tag);
        }
    });
};

/**
 * Show an tag
 */
exports.show = function(req, res) {
    res.jsonp(req.tag);
};

/**
 * List of Tags
 */
exports.all = function(req, res) {
    Tag.find(function(err, tags) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            console.log(tags);
            res.jsonp(tags);
        }
    });
};

