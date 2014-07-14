'use strict';

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var TagSchema = new Schema({
    period: Boolean,
    startTime: Number,
    endTime: Number,
    data: String,
    dateSubmitted: Date
});

// var VideoSchema = new Schema({
//     name: String,
//     tags: [TagSchema]
// });

//mongoose.model('Video', VideoSchema);

TagSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Tag', TagSchema);
