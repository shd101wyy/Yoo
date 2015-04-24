/*
 * Post Card
 */

/**
 * Create Post Card
 *
 * post_data =>
        _id: "5539e3e95164827434560b32"
        data: "ni ma bi"
        lat_region: 4010
        latitude: 40.1059233
        lon_region: -8821
        longitude: -88.2120315
        post_time: "2015-04-24T06:34:17.288Z"
        type: "text"
        username: "shd101wyy"
 *
 */
function createPostCard(post_data){
    var post_card = $("<div></div>").addClass("list-item card post_card");

    /*
    ################################
        top user info bar */
    var post_card_user_info = $("<div></div>").addClass("post_card_user_info");

    // user profile image
    var post_card_user_img = $("<img>").addClass("post_card_user_img").attr({id: "post_card_user_img" + post_data._id});
    socket.emit("post_card_user_profile_img", post_data.username, post_data._id);

    // username
    var post_card_username = $("<p></p>").addClass("post_card_username");
    post_card_username.text(post_data.username);
    // post date
    var post_card_post_date = $("<p></p>").addClass("post_card_post_date");
    post_card_post_date.text(post_data.post_time.slice(0, 10));
    post_card_user_info.append(post_card_user_img);
    post_card_user_info.append(post_card_username);
    post_card_user_info.append(post_card_post_date);

    // when user click the bar, check his info
    post_card_user_info.click(function(){
        showProfile(post_data.username);
    });



    /*
    ##################################
        content */
    // TODO: support photo and audio
    var post_card_content = $("<div></div>").addClass("post_card_content").text(post_data.data);

    /*
    ##################################
        bottom bar */
    var post_card_bottom_panel = $("<div></div>").addClass("post_card_bottom_panel");
    var grid = $("<div></div>").addClass("grid-2-1");
    // grid 0
    var grid_0 = $("<div></div>").addClass("grid-2-1-element");
    var post_card_btn_group0 = $("<div></div>").addClass("post_card_btn_group center");
    post_card_btn_group0.html('<i class="fa fa-comments-o post_card_btn_icon" style="display:table-cell;vertical-align:middle;"></i><p class="post_card_btn_noty"> comment </p>');
    grid_0.append(post_card_btn_group0);
    grid.append(grid_0);

    // grid 1
    var grid_1 = $("<div></div>").addClass("grid-2-1-element");
    var post_card_btn_group1 = $("<div></div>").addClass("post_card_btn_group center");
    post_card_btn_group1.attr({id: "post_card_btn_group1" + post_data._id});
    post_card_btn_group1.html('<i class="fa fa-thumbs-o-up post_card_btn_icon" style="display:table-cell;vertical-align:middle;"></i>');
    var like = $("<p></p>").addClass("post_card_btn_noty").text("like");
    post_card_btn_group1.append(like);
    grid_1.append(post_card_btn_group1);
    grid.append(grid_1);
    post_card_bottom_panel.append(grid);

    post_card.append(post_card_user_info);
    post_card.append(post_card_content);
    post_card.append(post_card_bottom_panel);


    // for post_card_btn_group1 (like), check like number
    socket.emit("post_card_check_like_num", post_data._id,
                                            window.username); // check whether this user liked this post as well.


    post_card_btn_group1.click(function(){
        // dislike
        if (post_card_btn_group1.hasClass("post_card_liked")){
            post_card_btn_group1.removeClass("post_card_liked");
            socket.emit("post_card_remove_like", post_data._id, window.username);
            if (parseInt(like.text()) === 1){
                like.text("like");
            }
            else{
                like.text(parseInt(like.text()) - 1);
            }
        }
        // like
        else{
            post_card_btn_group1.addClass("post_card_liked");
            socket.emit("post_card_add_like", post_data._id, window.username);
            if (like.text() === "like"){
                like.text("1");
            }
            else{
                like.text(1 + parseInt(like.text()));
            }
        }
    });

    return post_card;
}


/*
    Click homt_btn, check display nearby posts in format of Post Card
 */
$("#home_btn").click(function(){
    $(".footbar_btn_activated").removeClass("footbar_btn_activated");
    $("#home_btn").addClass("footbar_btn_activated");

    // check noty
    var n = parseInt($("#home_btn_noty").text());
    if (n !== 0){
        // set 0 and hide display
        $("#home_btn_noty").text(0);
        $("#home_btn_noty").hide();

        // go over not_displayed_posts
        for(var i = 0; i < window.not_displayed_posts.length; i++){
            var post = window.not_displayed_posts[i];
            // save post to displayed_posts
            window.displayed_posts[post._id] = post;

            // display post card
            var post_card = createPostCard(post);

            $("#yoo_card_list").prepend(post_card);
        }

        window.not_displayed_posts = []; // clear
    }
});
