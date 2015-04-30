/*
    Comment Page events
*/

/*
    make comment card for view
    eg:
    <div class="list-item card comment_card comment_is_me">
        <img class="post_card_user_img" src="images/default_profile_wall.jpg">
        <p class="comment_username">shd101wyy</p>
        <p class="comment_content"> Hello </p>
    </div>
 */
function makeCommentCard(username, content){
    var card = $("<div></div>").addClass("list-item card comment_card");
    if (username === window.username){
        card.addClass("comment_is_me");
    }

    var img = $("<img>").addClass("post_card_user_img profile_image_"+username);
    if (window.passby_user_photo[username]){
        img.attr({src: window.passby_user_photo[username]});
    }
    else{
        socket.emit("get_user_profile_img", username);
    }
    var comment_username = $("<div></div>").addClass("comment_username").text(username);
    var comment_content = $("<div></div>").addClass("comment_content").text(content);

    card.append(img).append(comment_username).append(comment_content);

    card.click(function(){
        showProfile(username);
    });
    return card;
}

// go back to main page.
$("#comment_page_back_btn").click(function(){
    $("#comment_page").hide();
    $("#yoo_page").show();
    $(".main_content").hide();
    $("#home_page").show();

    socket.emit("post_user_quit", window.current_post_id, window.username); // user quit comment room
});


// send comment
$("#comment_send_btn").click(function(){
    var content = $("#comment_input").val();
    if (content.trim() === "") return; // empty string
    $("#comment_input").val("");
    socket.emit("user_make_comment", window.username, window.current_post_id, content);

    $("#comment_panel").prepend(makeCommentCard(window.username, content));
});
