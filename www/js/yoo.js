
// global variables
window.longitude = null;
window.latitude = null;
window.socket = null;
window.username = null;
window.user_id = null;
// TODO: clear passby_people after midnight...
window.passby_people = {}; // save people that we passed by already, so we don't show their information again.

window.displayed_posts = {}; // already displayed posts, _id is the key
window.not_displayed_posts = []; // not displayed posts

window.displayed_passby = {};     // already displayed passby user, username is the key
window.not_displayed_passby = {}; // haven't displayed
window.passby_user_photo = {};    // photo data, username is the key

/**
 * Parse URL parameters and return a JSON data
 */
function parseURLParameters() {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    var output = {};
    for (var i=0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        output[pair[0]] = pair[1];
    }
    return output;
}

// round lon/lat to integer => region
function calculateRegion(degree) {
    return parseInt(degree * 100);
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

// show location
function showPosition(position) {
    // console.log(position);
    // First time init
    if(longitude === null && socket !== null){
        socket.emit("user_in_app", {longitude: position.coords.longitude,
                                             latitude: position.coords.latitude,
                                             lon_region: calculateRegion(position.coords.longitude),
                                             lat_region : calculateRegion(position.coords.latitude),
                                             username: username});
        // send location to server every 10s
        setInterval(function(){
            socket.emit("user_update_location", {longitude: longitude,
                                                  latitude: latitude,
                                                  lon_region: calculateRegion(longitude),
                                                  lat_region : calculateRegion(latitude),
                                                  username: username});
        }, 10000);
    }
    longitude = position.coords.longitude;
    latitude = position.coords.latitude;
    $("#lon_test").text("Lon: " + longitude.toString().slice(0, 6));
    $("#lat_test").text("Lat: " + latitude.toString().slice(0, 6));
}

// geolocation reader error.
function geolocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
    }
}

$(document).ready(function(){
    socket = io(); // initialize socketio.
    var data = parseURLParameters();
    user_id = data.id;
    username = data.name;

    $("#mainpage_header_title").text("Feeds"); // set header title
    $("#profile_user_title").text(username); // set username


    //document.body.addEventListener('touchmove', function(e){ e.preventDefault(); }); // prevent mobile device scrolling

    // ###################################################

    // show main page
    //$("#post_text_page").show();
    $("#yoo_page").show();
    $(".main_content").hide();
    $("#home_page").show();


    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
                showPosition,
                geolocationError,
                {
                    enableHighAccuracy: true, //,
                    //maximumAge: 0, //这两个iOS下不管用
                    timeout: 5000
                });
        } else {
            alert("Geolocation is not supported.");
        }


    // #########################################################################
    // #########################################################################
    // #############   HOME PAGE 4 BUTTONS #####################################
    // #########################################################################
    // #########################################################################

    /*
        Click Passby User button
     */
    $("#passby_user_btn").click(function(){
        $(".footbar_btn_activated").removeClass("footbar_btn_activated");
        $("#passby_user_btn").addClass("footbar_btn_activated");
    });


    /*
        Click Comment button
     */
    $("#comment_btn").click(function(){
        $(".footbar_btn_activated").removeClass("footbar_btn_activated");
        $("#comment_btn").addClass("footbar_btn_activated");
    });




    // other users nearby
    socket.on("receive_user_yoo", function(data){
        /**
         * TODO: After user click the nearby user card, they can have a private chat. follow/unfollow
         * check profile wall
         *
         */
        //console.log("receive user info");
        //console.log(data);

        var user_data = data[0];
        if (user_data.username in window.displayed_passby ||
            user_data.username in window.not_displayed_passby){
            return;
        }
        else{
            window.not_displayed_passby[user_data.username] = user_data;

            // increase notification number
            var n = parseInt($("#passby_user_btn_noty").text());
            $("#passby_user_btn_noty").text(n + 1);
            $("#passby_user_btn_noty").show();
            return;
        }
    });

    // receive passby user profile image
    socket.on("receive_passby_user_profile_image_data", function(data){
        console.log("receive passby user profile image");
        window.passby_user_photo[data[0]] = data[1];
    });


    // show homepage profile image
    socket.on("show_homepage_user_profile_image", function(data){
        if (data === ""){
            var identicon_data = new Identicon(window.username.hashCode()+"", 420).toString();
            $("#home_profile_image_btn").attr({"src": "data:image/png;base64," + identicon_data});
        }
        else{
            $("#home_profile_image_btn").attr({"src": "data:image/png;base64," + data});
        }
        $("#home_profile_image_btn").click(function(){
            showProfile(window.username);
        });
    });


    /*
     * User failed to make a post.
     */
     socket.on("failed_to_post", function(){
        alert("Failed to post");
        return;
     });

     /*
      * User make a post.
      */
     socket.on("post_saved", function(){
         alert("post successfully");
         return;
     });

     /*
      * User receive other people's post
      */
     socket.on("receive_other_peoples_post", function(data){
        if (data._id in window.displayed_posts){
            return;
        }
        else{
            // save to not displayed posts array
            window.not_displayed_posts.push(data);

            // increase notification number
            var n = parseInt($("#home_btn_noty").text());
            $("#home_btn_noty").text(n + 1);
            $("#home_btn_noty").show();
        }
     });


     // post card receive poster's profile image
     socket.on("post_card_receive_user_profile_image_data", function(image_data, post_id, username){
         if ($("#post_card_user_img" + post_id).attr("src")) return;
         if (image_data === ""){
             image_data = new Identicon(username.hashCode()+"", 420).toString();
         }
         $("#post_card_user_img" + post_id).attr({"src": "data:image/png;base64," + image_data});
     });


     // check whether user liked this post
     socket.on("post_card_liked", function(liked, post_id){
         if (liked){
             $("#post_card_btn_group1" + post_id).addClass("post_card_liked");
         }
         else{
             $("#post_card_btn_group1" + post_id).removeClass("post_card_liked");
         }
     });

     // get like num
     socket.on("post_card_receive_like_num", function(num, post_id){
         if (num === 0){
             $("#post_card_btn_group1" + post_id + " p").text("like");
         }
         else{
             console.log($("#post_card_btn_group1" + post_id + " p"));
             $("#post_card_btn_group1" + post_id + " > p").text(num);
         }
     });

});
