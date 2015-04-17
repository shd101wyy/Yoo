
// global variables
window.longitude = null;
window.latitude = null;
window.socket = null;
window.username = null;
window.user_id = null;

// TODO: clear passby_people after midnight...
window.passby_people = {}; // save people that we passed by already, so we don't show their information again.
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

    $("#username_title").text(username); // set username
    $("#profile_user_title").text(username); // set username


    //document.body.addEventListener('touchmove', function(e){ e.preventDefault(); }); // prevent mobile device scrolling

    /* */
    /* remove this later */
   //showProfile(username);


    // ###################################################

    // show main page
    $("#yoo_page").show();


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

    /*
     * I will change the functionality of yoo_btn
     */
    /*
    $("#yoo_btn").click(function(){
        socket.emit("user_update_location", {longitude: longitude,
                                             latitude: latitude,
                                             lon_region: calculateRegion(longitude),
                                             lat_region : calculateRegion(latitude),
                                             username: username});
    });
    */

    // other users nearby
    socket.on("receive_user_yoo", function(data){
        /**
         * TODO: After user click the nearby user card, they can have a private chat. follow/unfollow
         * check profile wall
         *
         * <div class="list-item card">
         *   <p class="passby_user_name"> shd101wyy: </p>
         *   <p> Hello </p>
         * </div>
         *
         */
        console.log("receive user info");
        var sender_name = data[0].username;

        // check passby already.
        if (sender_name in window.passby_people)
            return; // we already showed information before
        else
            window.passby_people[sender_name] = true;

        var sender_status = data[0].intro;
        var distance = data[1];
        var card = $("<div></div>").addClass("list-item card").empty();
        var card_profile_image = $("<img>").addClass("passby_user_profile_image")
                                            .attr({width: 40, height: 40, src: "/images/test.jpg",
                                                   id: "passby_user_" + sender_name + "_image"});
        var card_poster = $("<p></p>").addClass("passby_user_name").text(sender_name + ": ");
        var card_content = $("<p></p>").addClass("passby_user_intro").text(sender_status);
        card.append(card_profile_image);
        card.append(card_poster);
        card.append("<br><br>");
        card.append(card_content);
        //card.append("<p>distance(omit in future): " + distance + " </p>"); // dont show this in the future for privacy!

        // click user name => goto profile page
        card_poster.click(function(){
            showProfile(sender_name);
        });
        card_profile_image.click(function(){
            showProfile(sender_name);
        });

        // update passby user profile image
        socket.on("receive_passby_user_profile_image_data", function(data){
            card_profile_image.attr({"src": "data:image/png;base64," + data});
        });

        $("#yoo_card_list").prepend(card); // append to top.
    });


    // go back to Yoo_page
    $(".back_btn_from_profile_page").click(function(){
        $(".page").hide();
        $("#yoo_page").toggle("slide", {direction: "left"}, 400);
    });

    // go back to others profile page
    $("#back_btn_from_chat_page").click(function(){
        $(".page").hide();
        $("#others_profile_page").toggle("slide", {direction: "left"}, 400);
    });

    // goto chat_page
    $("#enter_chat_btn").click(function(){
        $(".page").hide();
        $("#chat_page").show();
    });

    // goto user profile page
    $("#username_title").click(function(){
        $(".page").hide();

        showProfile(username);
    });
});

/**
 * Check other user's profile page
 */
function gotoOthersProfilePage(sender_name){
    $(".page").hide();
    $("#others_profile_page").show();
    $("#profile_others_users_title").text(sender_name);
    $("#chat_others_users_title").text(sender_name);

    $("#profile_others_users_title").attr("username", sender_name);
    // alert($("#profile_others_users_title").attr("username"));
}
