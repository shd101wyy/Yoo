/**
 * Check other user's profile page
 */
function gotoOthersProfilePage(sender_name){
    $(".page").hide();
    $("#others_profile_page").show();
    $("#profile_others_users_title").text(sender_name);
    $("#chat_others_users_title").text(sender_name);

    $("#profile_others_users_title").attr("username", sender_name);
    // alert($("#profile_others_users_title").attr("username"));
}
