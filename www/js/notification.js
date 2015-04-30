/*
    Notification related events
 */

 /*
     Click Notification button
  */
 $("#notification_btn").click(function(){
     $(".footbar_btn_activated").removeClass("footbar_btn_activated");
     $("#notification_btn").addClass("footbar_btn_activated");

     $(".main_content").hide();
     $("#notification_page").show(); // show notification_page;
     $("#mainpage_header_title").text("Notification"); // change header title

     $("#notification_noty").text(1);
     $("#notification_noty").show();
 });
