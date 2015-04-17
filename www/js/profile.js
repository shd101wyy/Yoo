// user clicked profile image
$("#profile_image").click(function(){
    // TODO: check whether this is other user's profile
    $("#profile_image_input").click();
});

// this function will change user profile_image
$("#profile_image_input").change(function(){
    var file = $("#profile_image_input")[0].files[0];
    /*alert(file.name + "\n" +
          file.type + "\n" +
          file.size + "\n" +
          file.lastModifiedDate);
          */
    reader = new FileReader();
    reader.onload = (function (theImg) {
        return function (evt) {
            theImg.src = evt.target.result;
        };
    }(document.getElementById("profile_image")));
    reader.readAsDataURL(file);
});


// user clicked profile wall image
$("#profile_wall_image").click(function(){
    // TODO: check whether this is other user's profile
    $("#profile_wall_image_input").click();
});

// this function will change user profile_wall_image
$("#profile_wall_image_input").change(function(){
    var file = $("#profile_wall_image_input")[0].files[0];
    /*alert(file.name + "\n" +
          file.type + "\n" +
          file.size + "\n" +
          file.lastModifiedDate);
          */
    reader = new FileReader();
    reader.onload = (function (theImg) {
        return function (evt) {
            theImg.src = evt.target.result;
        };
    }(document.getElementById("profile_wall_image")));
    reader.readAsDataURL(file);
});
