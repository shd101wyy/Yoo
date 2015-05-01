// string hash
String.prototype.hashCode = function(){
    if (Array.prototype.reduce){
        return this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a;},0);
    }
    var hash = 0;
    if (this.length === 0) return hash;
    for (var i = 0; i < this.length; i++) {
        var character  = this.charCodeAt(i);
        hash  = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};
// TODO: allow user to delete profile image
//       to use identicon
// user clicked profile image
$("#profile_image").click(function(){
    if (window.username !== $("#profile_username").text()) return;
    $("#profile_image_input").click();
});

// this function will change user profile_image
$("#profile_image_input").change(function(){
    var file = $("#profile_image_input")[0].files[0];
    /*alert(file.name + "\n" +
          file.type + "\n" +
          file.size + "\n" +
          file.lastModifiedDate);
          */
    var reader = new FileReader();
    reader.onload = (function (theImg) {
        return function (evt) {
            theImg.src = evt.target.result;
            /*
                Here we got base64 data
                uplaod the image data to server.
            */
            //console.log(theImg.src);
            window.socket.emit("user_update_image", [$("#profile_username").text(),
                                                                  theImg.src,
                                                                  "profile_image"]);
        };
    }(document.getElementById("profile_image")));
    reader.readAsDataURL(file);
});


// user clicked profile wall image
$("#profile_wall_image").click(function(){
    if (window.username !== $("#profile_username").text()) return;
    $("#profile_wall_image_input").click();
});

// this function will change user profile_wall_image
$("#profile_wall_image_input").change(function(){
    var file = $("#profile_wall_image_input")[0].files[0];
    /*alert(file.name + "\n" +
          file.type + "\n" +
          file.size + "\n" +
          file.lastModifiedDate);
          */
    var reader = new FileReader();
    reader.onload = (function (theImg) {
        return function (evt) {
            theImg.src = evt.target.result;

            // upload image to server
            window.socket.emit("user_update_image", [$("#profile_username").text(),
                                                                  theImg.src,
                                                                  "profile_wall_image"]);
        };
    }(document.getElementById("profile_wall_image")));
    reader.readAsDataURL(file);
});

// calculate age
// refered from http://www.romcartridge.com/2010/01/javascript-function-to-calculate-age.html
function calculateAge(birthMonth, birthDay, birthYear)
{
  todayDate = new Date();
  todayYear = todayDate.getFullYear();
  todayMonth = todayDate.getMonth();
  todayDay = todayDate.getDate();
  age = todayYear - birthYear;

  if (todayMonth < birthMonth - 1)
  {
    age--;
  }

  if (birthMonth - 1 == todayMonth && todayDay < birthDay)
  {
    age--;
  }
  return age;
}


/**
 *
 * Show profile function
 * update user_profile_page
 *
 */
function showProfile(username){
    window.socket.emit("get_user_info", username);
    $("#yoo_btn_post_page").hide();

    socket.on("receive_user_info", function(user){
        /*
user:

        _id: "5530bb3903a7fcbc781440ba"
        birthday: "1994-03-30T06:00:00.000Z"
        gender: "Female"
        intro: ""
        location: ""
        profile_image: ""
        profile_wall_image: "default_profile_wall.jpg"
        username: "shd101wy
         */
        var username = user.username;
        // hide all other page and show profile page
        $(".page").hide();
        $("#user_profile_page").show();

        if (user.profile_image === ""){
            // show identicon if necessary
            var identicon_data = new Identicon(username.hashCode()+"", 420).toString();
            $("#profile_image").attr({"src": "data:image/png;base64," + identicon_data});
        }
        $("#profile_username").text(username); // set username

        // intro
        $("#profile_intro").text(user.intro);

        // age
        $("#profile_age").text(calculateAge(parseInt(user.birthday.slice(5, 7)),
                                            parseInt(user.birthday.slice(8, 10)),
                                            parseInt(user.birthday.slice(0, 5))));

        // gender
        $("#profile_gender").text(user.gender);

        // location
        $("#profile_location").text(user.location);

        // birthday
        $("#profile_birthday").text(user.birthday.slice(0, 10));

    });

    // change profile image
    socket.on("profile_receive_user_profile_image_data", function(username, data){
        var image_data = "data:image/png;base64," + data;
        $("#profile_image").attr({"src": image_data});
        window.passby_user_photo[username] = image_data;
    });

    // change profile wall image
    socket.on("profile_receive_user_profile_wall_image_data", function(data){
        $("#profile_wall_image").attr({"src": "data:image/png;base64," + data});
    });

    $("#profile_information_posts").html(""); // clear posts content
    $("#profile_information_passby_users").html(""); // clear following list
    $("#profile_select_profile").click(); // show profile info
}

// hide modify_intro_panel
$("#profile_intro_item").click(function(){
    if ($("#profile_username").text() !== window.username){
        return;
    }
    $("#modify_intro_panel").toggle();
});
$("#cancel_profile_intro_modify").click(function(){
    $("#modify_intro_panel").toggle();
});

// user update intro
$("#profile_intro_modify_submit").click(function(){
    var new_intro = $("#profile_intro_input").val();
    // allow user to enter maximum 100 characters
    if (new_intro.length > 100){
        alert("Maximum 100 characters exceed");
        return;
    }
    socket.emit("user_update_profile", [$("#profile_username").text(),
                                        new_intro,
                                        "intro"]);
    $("#profile_intro").text(new_intro);
    $("#modify_intro_panel").toggle();
});

// hide modify_location_panel
$("#profile_location_item").click(function(){
    if ($("#profile_username").text() !== window.username){
        return;
    }
    $("#modify_location_panel").toggle();
});
$("#cancel_profile_location_modify").click(function(){
    $("#modify_location_panel").toggle();
});

// user update location
$("#profile_location_modify_submit").click(function(){
    var new_intro = $("#profile_location_input").val();
    // allow user to enter maximum 100 characters
    if (new_intro.length > 100){
        alert("Maximum 100 characters exceed");
        return;
    }
    socket.emit("user_update_profile", [$("#profile_username").text(),
                                        new_intro,
                                        "location"]);
    $("#profile_location").text(new_intro);
    $("#modify_location_panel").toggle();
});


// hide modify_gender_panel
$("#profile_gender_item").click(function(){
    if ($("#profile_username").text() !== window.username){
        return;
    }
    $("#modify_gender_panel").toggle();
});
$("#cancel_profile_gender_modify").click(function(){
    $("#modify_gender_panel").toggle();
});

// update user gender
$("#profile_gender_modify_male").click(function(){
    socket.emit("user_update_profile", [$("#profile_username").text(),
                                        "Male",
                                        "gender"]);
    $("#profile_gender").text("Male");
    $("#modify_gender_panel").toggle();
});
$("#profile_gender_modify_female").click(function(){
    socket.emit("user_update_profile", [$("#profile_username").text(),
                                        "Female",
                                        "gender"]);
    $("#profile_gender").text("Female");
    $("#modify_gender_panel").toggle();
});

// hide modify_birthday_panel
$("#profile_birthday_item").click(function(){
    if ($("#profile_username").text() !== window.username){
        return;
    }
    $("#modify_birthday_panel").toggle();
});
$("#cancel_profile_birthday_modify").click(function(){
    $("#modify_birthday_panel").toggle();
});

// update user birthDay
$("#profile_birthday_modify_submit").click(function(){
    var birthday = $("#profile_birthday_input").val();
    var month = parseInt(birthday.slice(5, 7));
    var day = parseInt(birthday.slice(8, 10));
    var year = parseInt(birthday.slice(0, 5));
    $("#profile_birthday").text(birthday);
    $("#profile_age").text(calculateAge(month,
                                        day,
                                        year));

    // update database
    socket.emit("user_update_profile", [$("#profile_username").text(),
                                        month + "/" + day + "/" + year,
                                        "birthday"]);
    $("#modify_birthday_panel").toggle();
});

// go back to yoo page
$("#profile_page_back_btn").click(function(){
    $(".page").hide();
    $("#yoo_page").show();
    $("#home_page").show();

    $("#profile_information_posts").html(""); // clear posts content
    $("#profile_information_passby_users").html(""); // clear following list

    $("#home_btn").click();
});


// user check profile
$("#profile_select_profile").click(function(){
    // selected
    $(".profile_selection").removeClass("profile_selected");
    $("#profile_select_profile > p").addClass("profile_selected");

    // show content
    $(".profile_information").hide();
    $("#profile_information_content_list").show();

});

$("#profile_select_posts").click(function(){
    // selected
    $(".profile_selection").removeClass("profile_selected");
    $("#profile_select_posts > p").addClass("profile_selected");

    // show content
    $(".profile_information").hide();
    $("#profile_information_posts").show();


    if ($("#profile_information_posts").html().trim() === ""){
        // get user posts
        var u_name = $("#profile_username").text();
        socket.emit("profile_get_user_posts", u_name);
    }
});

$("#profile_select_passby").click(function(){
    // selected
    $(".profile_selection").removeClass("profile_selected");
    $("#profile_select_passby > p").addClass("profile_selected");

    // show content
    $(".profile_information").hide();
    $("#profile_information_passby_users").show();

    if ($("#profile_information_passby_users").html().trim() === ""){
        // get users that this user is now following.
        var u_name = $("#profile_username").text();
        socket.emit("profile_get_user_following", u_name);
    }
});

// create brief user intro for passby page
function createFollowingUserBriefIntro(user_data){
    var card = $("<div></div>").addClass("list-item card");
    var follow_user_intro_div = $("<div></div>").addClass("follow_user_intro_div");
    var follow_user_intro_div_left = $("<div></div>").addClass("follow_user_intro_div_left");
    var follow_user_intro_div_middle = $("<div></div>").addClass("follow_user_intro_div_middle");
    var follow_user_intro_div_right = $("<div></div>").addClass("follow_user_intro_div_right");
    follow_user_intro_div.append(follow_user_intro_div_left);
    follow_user_intro_div.append(follow_user_intro_div_middle);
    follow_user_intro_div.append(follow_user_intro_div_right);
    card.append(follow_user_intro_div);

    var unfollow_btn = $('<i class="fa fa-user-times" style="float:left; color: #e85d47;"></i>');
    var chat_btn = $('<i class="fa fa-comment" style="float:right"></i>');
    // chat | unfollow button
    follow_user_intro_div_right.append(unfollow_btn).append(chat_btn);

    var img = $("<img>").addClass("follow_user_img profile_image_"+user_data.username);
    follow_user_intro_div_left.append(img);
    if (window.passby_user_photo[user_data.username]){
        img.attr({src: window.passby_user_photo[user_data.username]});
    }
    else{
        socket.emit("get_user_profile_img", user_data.username);
    }

    var follow_user_bar = $("<div></div>").addClass("follow_user_bar");
    var follow_username = $("<p></p>").addClass("follow_username").text(user_data.username);
    var follow_user_intro = $("<div></div>").addClass("follow_user_intro").text(user_data.intro);
    follow_user_bar.append(follow_username);
    follow_user_intro_div_middle.append(follow_user_bar);
    follow_user_intro_div_middle.append(follow_user_intro);

    // unfollow user
    unfollow_btn.click(function(evt){
        evt.preventDefault();
        evt.stopPropagation();
        socket.emit("unfollow_user", window.username, user_data.username);
        card.hide("slow", function(){ card.remove();});

        delete(window.user_follow[user_data.username]);
    });

    // show chatpage
    chat_btn.click(function(evt){
        evt.preventDefault();
        evt.stopPropagation();
        showChatPage(user_data.username);
    });

    // check user profile
    card.click(function(){
        showProfile(user_data.username);
    });
    return card;
}
