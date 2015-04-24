/**
 *
 * Yoo button related event
 *
 */
 /*
     Click Yoo button, Post
 */
 $("#yoo_btn").click(function(){
     $("#yoo_btn_post_page").show();
 });

/*
 *  Hide post panel
 */
$("#close_bottom_panel").click(function(){
    $("#yoo_btn_post_page").hide();
});



/*
 * Post Text Page
 */
$("#yoo_btn_post_text_btn").click(function(){
    $("#yoo_btn_post_page").hide();
    $("#yoo_page").hide();
    $("#post_text_page").show();
});

/*
 * User post text message
 */
$("#post_text_page_post_text").click(function(){
    var text = $("#post_text_textarea").val();
    window.socket.emit("user_post_text", content);
});

// go back to homepage
$("#post_text_page_back_btn").click(function(){
    $("#post_text_page").hide();
    $("#yoo_page").show();
});


/*
 * Post Photo Page
 */




 /*
  * Post Audio Page
  */
