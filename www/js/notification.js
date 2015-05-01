/*
    Notification related events
 */

/*
    Increase noty by 1 given its jquery selector (eg "#notification_noty")
 */
function notyIncreaseBy1(noty){
    var noty_num = parseInt($(noty).text());
    noty_num += 1;
    $(noty).text(noty_num);
    $(noty).show();
}

/*
    Decrement noty by 1 given its jquery selector (eg "#notification_noty")
 */
function notyDecrementBy1(noty){
    var noty_num = parseInt($(noty).text());
    noty_num -= 1;
    $(noty).text(noty_num);
    if (noty_num === 0){
        $(noty).hide();
    }
    else{
        $(noty).show();
    }
}



 /*
     Click Notification button
  */
 $("#notification_btn").click(function(){
     $(".footbar_btn_activated").removeClass("footbar_btn_activated");
     $("#notification_btn").addClass("footbar_btn_activated");

     $(".main_content").hide();
     $("#notification_page").show(); // show notification_page;
     $("#mainpage_header_title").text("Notification"); // change header title
 });

/*
    create notification card

    profile_image   username
                    content ...
 */
function createNotificationCard(chat_to_username, history){
    var card = $("<div></div>").addClass("list-item card comment_card").attr({id: "notification_chat_" + chat_to_username });
    var img = $("<img>").addClass("post_card_user_img profile_image_"+chat_to_username);
    // set img source
    if (window.passby_user_photo[chat_to_username]){
        img.attr({src: window.passby_user_photo[chat_to_username]});
    }
    else{
        socket.emit("get_user_profile_img", chat_to_username); // get profile img from server.
    }

    var notification_username = $("<div></div>").addClass("notification_username").text(chat_to_username);
    var notification_content = $("<div></div>").addClass("notification_content").text( (window.username === history[history.length - 2] ? "" : (history[history.length - 2] + ": ")) + history[history.length - 1]);

    card.append(img).append(notification_username).append(notification_content);
    return card;
}


/*
    create notification card

    profile_image   username
                    content ...
 */
function createNotificationCardForPostComment(from_username, content){
    var card = $("<div></div>").addClass("list-item card comment_card");
    var notification_username = $("<div></div>").addClass("notification_username").text(from_username);
    var notification_content = $("<div></div>").addClass("notification_content").text( content );

    card.append(notification_username).append(notification_content);
    return card;
}

/*
    Add notification to Notification page.
 */
function notificationAddChatHistory(histories){
    var createHandler = function(chat_to_username){
        return (function(){
            showChatPage(chat_to_username);
            if (card.hasClass("this_is_notification")){
                card.removeClass("this_is_notification");
                notyDecrementBy1("#notification_noty"); // decrement noty
            }
        });
    }
    for(var chat_to_username in histories){
        var history = histories[chat_to_username];
        var card = createNotificationCard(chat_to_username, history);
        $("#notification_card_list").prepend(card);

        card.click(createHandler(chat_to_username));
    }
}
