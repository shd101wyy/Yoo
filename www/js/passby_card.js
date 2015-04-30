/**
 *
 * Passby Card  (name card)
 *
 * user_data =>
 *
 *  __v: 0
    _id: "5530c2f6570ffa2d7c130072"
    birthday: "1995-04-01T06:00:00.000Z"
    gender: "Male"
    intro: "This is shd101wyy2 lol,↵I am the most clever guy in this world"
    location: "I am living in Urbana"
    profile_image: "a71ea1c0-e4df-11e4-9383-3d0bc6ce7c78.jpg"
    profile_wall_image: "82c9f130-e4df-11e4-b570-bf5e1b1ab729.jpg"
    username: "shd101wyy2"
 *
 */
function createPassbyCard(user_data){

    var passby_card = $("<div></div>").addClass("list-item card passby_card");

    // profile content
    var passby_user_profile = $("<div></div>").addClass("passby_user_profile");
    var passby_user_profile_content = $("<div></div>").addClass("passby_user_profile_content");
    var passby_username_bar = $("<div></div>").addClass("passby_username_bar");
    var passby_username = $("<p></p>").addClass("passby_username");
    passby_username.text(user_data.username);
    var passby_user_intro = $("<div></div>").addClass("passby_user_intro");
    passby_user_intro.text(user_data.intro);
    var passby_card_user_img = $("<img>").addClass("passby_card_user_img");
    passby_card_user_img.attr({id: "passby_user_" + user_data.username + "_image"});
    if (user_data.profile_image === ""){
        // show identicon if necessary
        var identicon_data = new Identicon(user_data.username.hashCode()+"", 420).toString();
        passby_card_user_img.attr({"src": "data:image/png;base64," + identicon_data});
    }
    if (user_data.username in window.passby_user_photo){
        passby_card_user_img.attr({"src": window.passby_user_photo[user_data.username]});
    }

    passby_username_bar.append(passby_username);
    passby_user_profile_content.append(passby_username_bar).append(passby_user_intro);
    passby_user_profile.append(passby_card_user_img).append(passby_user_profile_content);

    // bottom button group
    var passby_card_bottom_panel = $("<div></div>").addClass("passby_card_bottom_panel");
    var grid = $("<div></div>").addClass("grid-2-1");
    // grid 0
    var grid_0 = $("<div></div>").addClass("grid-2-1-element");
    var post_card_btn_group0 = $("<div></div>").addClass("post_card_btn_group center");
    post_card_btn_group0.html('<i class="fa fa-user-plus post_card_btn_icon" style="display:table-cell;vertical-align:middle;"></i>');
    var follow_p = $("<p class='post_card_btn_noty'> follow </p>");
    post_card_btn_group0.append(follow_p);
    grid_0.append(post_card_btn_group0);
    grid.append(grid_0);

    // grid 1
    var grid_1 = $("<div></div>").addClass("grid-2-1-element");
    var post_card_btn_group1 = $("<div></div>").addClass("post_card_btn_group center");
    post_card_btn_group1.html('<i class="fa fa-paper-plane-o post_card_btn_icon" style="display:table-cell;vertical-align:middle;"></i><p class="post_card_btn_noty"> chat </p>');
    grid_1.append(post_card_btn_group1);
    grid.append(grid_1);
    passby_card_bottom_panel.append(grid);

    // click profile image or name to view profile
    passby_username.click(function(){
        showProfile(user_data.username);
    });
    passby_card_user_img.click(function(){
        showProfile(user_data.username);
    });


    // show color if the user is follwed.
    if (user_data.username in window.user_follow){
        post_card_btn_group0.addClass("user_followed");
        follow_p.text("following");
    }

    // follow user or unfollow user
    post_card_btn_group0.click(function(){
        if (post_card_btn_group0.hasClass("user_followed")){ // unfollow user
            socket.emit("unfollow_user", window.username, user_data.username);
            post_card_btn_group0.removeClass("user_followed");
            follow_p.text("follow");
        }
        else{ // follow user
            socket.emit("follow_user", window.username, user_data.username);
            post_card_btn_group0.addClass("user_followed");
            follow_p.text("following");
        }
    });

    passby_card.append(passby_user_profile);
    passby_card.append(passby_card_bottom_panel);
    return passby_card;

}



/*
    Click homt_btn, check display nearby posts in format of Post Card
 */
$("#passby_user_btn").click(function(){
    $(".footbar_btn_activated").removeClass("footbar_btn_activated");
    $("#passby_user_btn").addClass("footbar_btn_activated");

    $(".main_content").hide();
    $("#passby_page").show(); // show passby_page
    $("#mainpage_header_title").text("Passby"); // change header title


    // check noty
    var n = parseInt($("#passby_user_btn_noty").text());
    if (n !== 0){
        // set 0 and hide display
        $("#passby_user_btn_noty").text(0);
        $("#passby_user_btn_noty").hide();

        // go over not_displayed_posts
        for(var username in window.not_displayed_passby){
            var user_data = window.not_displayed_passby[username];
            // save post to displayed_posts
            window.displayed_passby[user_data.username] = user_data;

            // display passby card
            var passby_card = createPassbyCard(user_data);

            $("#passby_card_list").prepend(passby_card);
        }

        window.not_displayed_passby = {}; // clear
    }
});
