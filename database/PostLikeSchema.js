/**
 *
 *  I will change this schema in the future
 *
 *  User Schema:
 *  	post_id     id of the post
 *  	username    who liked this post
 *  	_id         id of this like
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
var likeSchema = new Schema({
    post_id: {type: String},
    username: {type: String}
});

// create model that uses the schema
var db_PostLike = mongoose.model("PostLike", likeSchema);

// make this available to our users.
module.exports = db_PostLike;
