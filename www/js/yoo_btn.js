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
    // send data to server
    window.socket.emit("user_post", {
        data: text,
        type: "text",
        longitude: window.longitude,
        latitude: window.latitude,
        lon_region: calculateRegion(window.longitude),
        lat_region: calculateRegion(window.latitude)

    });
    $("#post_text_page").hide();
    $("#yoo_page").show();
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
