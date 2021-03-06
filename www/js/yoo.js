
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

window.audio_context = null;  // audio recording
window.recorder = null;


window.current_post_id = null; // for post comment

window.user_follow = {}; // people that user is now following.

window.chat_history = {}; // local storage chat history


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

        // load weather
        loadWeather(position.coords.latitude+','+position.coords.longitude);
    }
    longitude = position.coords.longitude;
    latitude = position.coords.latitude;
    $("#lon_test").text("Lon: " + longitude.toString().slice(0, 6));
    $("#lat_test").text("Lat: " + latitude.toString().slice(0, 6));
}

function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    console.log('Media stream created.');

    // Uncomment if you want the audio to feedback directly
    //input.connect(audio_context.destination);
    //__log('Input connected to audio context destination.');

    window.recorder = new Recorder(input);
    console.log('Recorder initialised.');
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
    window.socket = io(); // initialize socketio.
    var data = parseURLParameters();
    window.user_id = data.id;
    window.username = data.name;

    // read data from localStorage
    if (window.localStorage[window.username + "_chat"]){
        window.chat_history = JSON.parse(window.localStorage[window.username + "_chat"]);
        //console.log("chat history");
        //console.log(window.chat_history);

        notificationAddChatHistory(window.chat_history);
    }
    else{
        window.localStorage[window.username + "_chat"] = "{}";
    }


    $("#mainpage_header_title").text("Feeds"); // set header title
    $("#profile_user_title").text(username); // set username


    //document.body.addEventListener('touchmove', function(e){ e.preventDefault(); }); // prevent mobile device scrolling

    // ###################################################

    // show main page

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
            toastr.error("Geolocation is not supported.");
    }

    // recording audio initialization.
    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      window.URL = window.URL || window.webkitURL;

      audio_context = new AudioContext();
      console.log('Audio context set up.');
      console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));

      navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
        console.log('No live audio input: ' + e);
      });

    } catch (e) {
      toastr.error('No web audio support in this browser!');
    }




    // #########################################################################
    // #########################################################################
    // #############   HOME PAGE 4 BUTTONS #####################################
    // #########################################################################
    // #########################################################################



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
    socket.on("receive_passby_user_profile_image_data", function(username, image_data){
        image_data = "data:image/png;base64," + image_data;
        window.passby_user_photo[username] = image_data; // save user photo.
    });


    // show homepage profile image
    socket.on("show_homepage_user_profile_image", function(data, user_data){
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

        // init some global variables
        for(var i = 0; i < user_data.follow.length; i++){
            window.user_follow[user_data.follow[i]] = true;
        }
        // console.log(window.user_follow);
    });


     /*
      * User make a post.
      */
     socket.on("post_saved", function(){
         toastr.info("post successfully");
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


     // receive poster's profile image
     socket.on("receive_user_profile_image_data", function(image_data, username){
         if (image_data === ""){
             image_data = "data:image/png;base64," + (new Identicon(username.hashCode()+"", 420).toString());
             $(".profile_image_" + username).attr({"src": image_data});
        }
         else{
             image_data = "data:image/png;base64," + image_data;
             $(".profile_image_" + username).attr({"src": image_data});
         }
         window.passby_user_photo[username] = image_data; // save user photo.
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
             $("#post_card_btn_group1" + post_id + " > p").text(num);
         }
     });

     // receive user posts for profile
     socket.on("profile_receive_user_posts", function(posts){
         for(var i = 0; i < posts.length; i++){
             var post = posts[i];
             // display post card
             var post_card = createPostCard(post);
             $("#profile_information_posts").prepend(post_card);
         }
     });

     // receive info of user that current user is following
     socket.on("profile_receive_user_following", function(user_data){
        $("#profile_information_passby_users").append(createFollowingUserBriefIntro(user_data));
     });


     // receive comments for post
     socket.on("post_receive_comments", function(comments){
         for(var i = 0; i < comments.length; i+=2){
             $("#comment_panel").prepend(makeCommentCard(comments[i], comments[i+1]));
         }
     });

     // receive one comment for post from other user
     socket.on("post_receive_one_comment", function(username, content, post_data){
         if (post_data === null){
            $("#comment_panel").prepend(makeCommentCard(username, content));
            return;
         }
         else{ // check whether need notification...
            var post_id = post_data._id;
            if ($("#comment_page").is(":visible") && window.current_post_id === post_id){ // no need to make notification since user is now in that comment page.
                $("#comment_panel").prepend(makeCommentCard(username, content));
            }
            else{
                if ($("post_comment_for_post_id_" + post_id).length){ // notification of the comment for the same post is already existed
                    $("post_comment_for_post_id_" + post_id + " > .notification_content").text(username + ": " + content); // change content.
                }
                else{
                    // create notification card.
                    var card = createNotificationCardForPostComment("You got one post comment from: ", username + ": " + content);
                    card.addClass("post_comment_for_post_id_" + post_id);
                    $("#notification_card_list").prepend(card);
                    notyIncreaseBy1("#notification_noty");

                    // when click remove card
                    card.click(function(){
                        $(".post_comment_for_post_id_" + post_id).remove();
                        notyDecrementBy1("#notification_noty");

                        // show comment page
                        $(".main_content").hide();
                        $(".page").hide();
                        $("#comment_page").show();
                        var post_card = createPostCard(post_data);

                        $("#comment_page_card").html("");
                        $("#comment_page_card").append(post_card.children(".post_card_user_info"));
                        $("#comment_page_card").append(post_card.children(".post_card_content"));
                        $("#comment_panel").html(""); // clear comments history

                        window.current_post_id = post_id; // get post_id

                        socket.emit("post_get_comments", post_id, window.username);

                    });
                }

            }
         }
     });

     // receive user chat data
     socket.on("receive_chat_content", function(username, content){
         if ($("#chat_page").is(":visible")){ // user is now chatting with this user.
             $("#chat_panel").prepend(createChatCard(username, content));

             if (window.chat_history[window.chat_to_username]){
                 window.chat_history[window.chat_to_username].push(username, content); // save to history
             }
             else{
                 window.chat_history[window.chat_to_username] = [username, content];
             }
             window.localStorage[window.username + "_chat"] = JSON.stringify(window.chat_history);

         }
         else{ // send notification.
             if (window.chat_history[username]){ // conversation already existed
                 window.chat_history[username].push(username, content); // save to history
             }
             else{ // this conversation is not existed before...
                 window.chat_history[username] = [username, content];
                 notificationAddChatHistory(window.chat_history); // refresh notification page.
             }
             window.localStorage[window.username + "_chat"] = JSON.stringify(window.chat_history);

             // mark the card as notification
             var notification_card = $("#notification_chat_" + username);
             notification_card.addClass("this_is_notification");
             notification_card.children(".notification_content").text("You get a message from " + username + ": " + content);

             // increase notification num
             notyIncreaseBy1("#notification_noty");
         }
     });

     // error
     socket.on("request_error", function(data){
         // TODO: write notification library.
         toastr.error(data);
     });
});
