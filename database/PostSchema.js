/**
 *
 *  I will change this schema in the future
 *
 *  Text Post Schema:
 *  	username
 *  	data
 *  	type    : text | photo | audio
 *  	longitude
 *  	latitude
 *  	lon_region
 *  	lat_region
 *  	post_time
 *  	_id
 *
 *
 *
 *
 */
// grab the things we need
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://127.0.0.1/Yoo");

/**
 * Check database connection
 **/
var db = mongoose.connection;
db.on("error", function(){
    console.log("Failed to connect to database: users");
});

db.once("open", function(callback){
    console.log("Connected to database: users");
});

// create schema
var PostSchema = new Schema({
    username: {type: String, required: true},
    data: {type: String, required: true},
    type: {type: String, required: true},
    longitude: {type: Number, required: true},
    latitude: {type: Number, required: true},
    lon_region: {type: Number, required: true},
    lat_region: {type: Number, required: true},
    post_time: {type: Date, default: Date.now}
});

// create model that uses the schema
var db_Post = mongoose.model("Post", PostSchema);

// make this available to our users.
module.exports = db_Post;
