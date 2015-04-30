/**
 *
 *  I will change this schema in the future
 *
 *  Comment Schema:
 *      comment_id  post_id
 *  	content    [user1 content1 user2 content2 ... ]
 *  	_id
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
var commentSchema = new Schema({
    comment_id: {type: String, required: true},
    content: {type: Array, required: true, default: []}
});

// create model that uses the schema
var db_Comment = mongoose.model("comment", commentSchema);

// make this available to our users.
module.exports = db_Comment;
