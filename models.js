'use strict';

var mongoose = require('mongoose')
    , crypto = require('crypto')
    , Schema = mongoose.Schema;

var TagSchema = new Schema({
    period: Boolean,
    startTime: Number,
    endTime: Number,
    data: String,
    dateSubmitted: Date,
    comments: String,
    vidName: String,
    username: String
});

var VideoSchema = new Schema({
    name: String,
    users: [String],
    numberOfUsers: {type: Number, default: 0},
    duration: Number
});

mongoose.model('Video', VideoSchema);

TagSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Tag', TagSchema);






/**
 * User Schema
 */
var UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: String
});

UserSchema.methods = {
    authenticate: function(plainText) {
        return plainText === this.password;
    }
};

mongoose.model('User', UserSchema);
