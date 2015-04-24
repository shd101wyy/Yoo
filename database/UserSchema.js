/**
 *
 *  I will change this schema in the future
 *
 *  User Schema:
 *  	username
 *  	password
 *  	intro
 *  	gender
 *  	location
 *  	birthday
 *  	profile_wall_image
 *  	profile_image
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
var userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    intro: {type: String, default: ""},
    gender: {type: String, default: "Female"},
    location: {type: String, default: ""},
    birthday: {type: Date, default: "03/30/1994"},
    profile_wall_image: {type: String, default:"default_profile_wall.jpg"},
    profile_image: {type: String, default: ""}
});

// create model that uses the schema
var db_User = mongoose.model("User", userSchema);

// make this available to our users.
module.exports = db_User;
