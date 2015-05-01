$(document).ready(function(){
    var socket = io();
    $("#signup_login_page").show(); // show page
    document.body.addEventListener('touchmove', function(e){ e.preventDefault(); }); // prevent mobile device scrolling

    // choose login form
    $("#choose_login_form").click(function(){
        $("#login_form").show();
        $("#signup_form").hide();
    });

    // choose signup form
    $("#choose_signup_form").click(function(){
        $("#signup_form").show();
        $("#login_form").hide();
    });

    // user sign up
    $("#signup_btn").click(function(){
        var username = $("#signup_username").val();
        var password = $("#signup_password").val();
        var password_repeat = $("#signup_password_repeat").val();
        if (password !== password_repeat){
            toastr.error("Password doesn't match, please enter again");
            return;
        }
        socket.emit("user_signup", [username, password]);
    });

    // user log in
    $("#login_btn").click(function(){
        var username = $("#login_username").val();
        var password = $("#login_password").val();
        socket.emit("user_login", [username, password]);
    });

    // error
    socket.on("request_error", function(data){
        // TODO: write notification library.
        toastr.error(data);
    });

    // login/signup success
    socket.on("signup_login_success", function(data){
        window.location.href = "./yoo.html?name="+data[0]+"&id="+data[1];
    });

});
