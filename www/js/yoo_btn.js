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
