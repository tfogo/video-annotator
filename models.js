var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
 
// Schema
var VideoSchema = new Schema({
    id: Number
});
 
mongoose.model('Video', VideoSchema);
