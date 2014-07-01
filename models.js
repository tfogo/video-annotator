'use strict';

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var EvaluationsSchema = new Schema({
    lighting: Number,
    quality: Number,
    content: Number,
    terrain: Number,
    shot: Number,
    misc: Number
});

var TagSchema = new Schema({
    period: Boolean,
    startTime: Number,
    endTime: Number,
    metadataType: String,
    data: String //Replace with subdocs for each metadata type
});

var VideoSchema = new Schema({
    name: String,
    evaluations: [EvaluationsSchema],
    tags: [TagSchema]
});

mongoose.model('Video', VideoSchema);
