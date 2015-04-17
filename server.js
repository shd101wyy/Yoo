var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var sanitize = require("./js/SanitizeString.js");
var fs = require("fs");

/**
 * Database Schema
 */
var db_User = require("./database/UserSchema.js"); // require database User model


var user_data = {}; // used to save user location
                    // [lon, lat]

var user_socket = {}; // key is username. val is socket
/**
 * Encrypt string
 */
function encrypt(text){
  var cipher = crypto.createCipher(algorithm, "asdfnjksaQW");
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

/**
 * Decrypt string
 */
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,"asdfnjksaQW");
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}

// calculate distance between 2 points
function calculateDistance(lon1, lat1, lon2, lat2) {
    var R = 6371 * 1000; // m
    var phi1 = lat1 / 180 * Math.PI;
    var phi2 = lat2 / 180 * Math.PI;
    var delta_phi = (lat2 - lat1) / 180 * Math.PI;
    var delta_lambda = (lon2 - lon1) / 180 * Math.PI;
    var a = Math.sin(delta_phi / 2) * Math.sin(delta_phi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(delta_lambda / 2) * Math.sin(delta_lambda / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}


/**
    Include a static file serving middleware at the top of stack
*/
app.use(express.static(__dirname + '/www'));
app.get('/', function(req, res){
   res.render("/www/index.html");  // render index.html
});

io.on("connection", function(socket){
    console.log("User: " + socket.id + " connected");

    // user signup
    socket.on("user_signup", function(data){
        var username = data[0];
        var password = data[1];

        // validate username and password
        if (!sanitize.usernameValid(username)){
            socket.emit("request_error", "Invalid username: " + username);
            return;
        }
        if(!sanitize.userpasswordValid(password)){
            socket.emit("request_error", "Invalid password");
            return;
        }

        password = encrypt(password); // encrypt password

        // create new user
        var new_user = db_User({
            username: username,
            password: password
        });

        // save to database
        new_user.save(function(error){
            if (error){
                socket.emit("request_error", "Username already existed");
            }
            else{
                socket.emit("signup_login_success", [username, new_user._id]);
            }
        });
    });

    // user login
    socket.on("user_login", function(data){
        var username = data[0];
        var password = data[1];

        // one user can only login to one device
        if (username in user_data){
            socket.emit("request_error", "Unable to log in");
            return;
        }

        // validate username and password
        if (!sanitize.usernameValid(username)){
            socket.emit("request_error", "Invalid username: " + username);
            return;
        }
        if(!sanitize.userpasswordValid(password)){
            socket.emit("request_error", "Invalid password");
            return;
        }

        password = encrypt(password); // encrypt password

        // create new user
        var new_user = db_User({
            username: username,
            password: password
        });

        db_User.find({username: username, password: password}, function(error, users){
            if (error || !users || users.length === 0){ // no such user exists
                socket.emit("request_error", "Wrong username or password");
            }
            else{
                socket.emit("signup_login_success", [username, users[0]._id]);
            }
        });
    });

    /**
     * This function will check whether there are nearby users.
     * If there is nearby user, send status to that nearby user.
     */
    function checkNearbyUsers(data){
        // check nearby users(within 200 meters).
        for(var username in user_data){
            if (username === data.username){
                continue;
            }
            var distance = calculateDistance(data.longitude, data.latitude, user_data[username][0], user_data[username][1]);
            console.log(distance);

            // TODO: check region in the future.
            // Right now only within 200 meters
            if (distance <= 200 ){
                // TODO: allow user to change status.
                // send my status to nearby user
                user_socket[username].emit("receive_user_yoo", [data.username, "Yoo", distance]);

                // receive nearby user's status
                socket.emit("receive_user_yoo", [username, "Yoo", distance]);
            }
        }
    }

    // user login to the application
    socket.on("user_in_app", function(data){
        socket.username = data.username; // save username to that socket.
        var longitude = data.longitude;
        var latitude = data.latitude;
        var lon_region = data.lon_region;
        var lat_region = data.lat_region;
        user_data[data.username] = [longitude, latitude, lon_region, lat_region];
        user_socket[data.username] = socket;

        checkNearbyUsers(data);
    });

    // user update location
    socket.on("user_update_location", function(data){
        //console.log("Yoo");
        var longitude = data.longitude;
        var latitude = data.latitude;
        var lon_region = data.lon_region;
        var lat_region = data.lat_region;

        //  user still in this region, no need to check
        if (lon_region === user_data[socket.username][2] && lat_region === user_data[socket.username][3]){
            return;
        }
        // update information
        user_data[socket.username] = [longitude, latitude, lon_region, lat_region];

        checkNearbyUsers(data);
        // send "Yoo" to this
    });

    // user get data
    socket.on("get_user_info", function(username){
        db_User.find({username: username}, function(error, users){
            if (error || !users || users.length !== 1){
                socket.emit("request_error", "Unable to get info about user: " + username);
            }
            else{
                var user = users[0];

                // send user profile_image data
                if (user.profile_image !== ""){
                    fs.readFile(__dirname + "/www/images/" + user.profile_image, function(err, buf){
                        // console.log("Image: " + buf.toString("base64"));
                        socket.emit("receive_user_profile_image_data", buf.toString("base64"));
                    });
                }

                // send user profile_wall_image data
                if (user.profile_wall_image !== ""){
                    fs.readFile(__dirname + "/www/images/" + user.profile_wall_image, function(err, buf){
                        // console.log("Image: " + buf.toString("base64"));
                        socket.emit("receive_user_profile_wall_image_data", buf.toString("base64"));
                    });
                }
                socket.emit("receive_user_info", users[0]);
            }
        });
    });

    // user disconnect
    socket.on("disconnect", function(){
        delete(user_data[socket.username]); // user logout
        delete(user_socket[socket.username]);
    });
});


// setup server
http.listen(3000, function(){
    console.log("Listening on port 3000");
});