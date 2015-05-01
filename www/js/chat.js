/*
 *  Chat Page related events
 */
function showChatPage(chat_to_username){
    $(".main_content").hide();
    $(".page").hide();
    $("#chat_page").show();

    $("#chat_panel").html(""); // clear chat page...
    
    $("#chat_panel").append(createChatCard(window.username, "Hello"))
                    .append(createChatCard("shd101wyy2", "Yooo"))
                    .append(createChatCard("shd101wyy2", "Yooo"))
                    .append(createChatCard(window.username, "Hello"));
}
/* go back to home page */
$("#chat_page_back_btn").click(function(){
    $("#chat_page").hide();
    $("#yoo_page").show();
    $(".main_content").hide();
    $("#home_page").show();
    $("#home_btn").click();
});

/*
    Create chatcard
 */
function createChatCard(username, content){
    var card = $("<div></div>").addClass("list-item card comment_card");
    var img = $("<img>").addClass("profile_image_"+username);
    var chat_username;
    var chat_content = $("<div></div>").text(content);

    // my message
    if (username === window.username){
        img.addClass("post_card_user_img_me");
        chat_content.addClass("comment_content_me");
        card.append(chat_content).append(img);
        card.addClass("chat_is_me");
    }
    // message from other people
    else{
        img.addClass("post_card_user_img");
        chat_content.addClass("comment_content");
        chat_username = $("<div></div>").addClass("comment_username").text(username);
        card.append(img).append(chat_username).append(chat_content);
    }

    // set img source
    if (window.passby_user_photo[username]){
        img.attr({src: window.passby_user_photo[username]});
    }
    else{
        socket.emit("get_user_profile_img", username); // get profile img from server.
    }
    return card;
}
