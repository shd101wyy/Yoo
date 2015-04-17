// string hash
String.prototype.hashCode = function(){
    if (Array.prototype.reduce){
        return this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a;},0);
    }
    var hash = 0;
    if (this.length === 0) return hash;
    for (var i = 0; i < this.length; i++) {
        var character  = this.charCodeAt(i);
        hash  = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

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
            /*
                Here we got base64 data
                uplaod the image data to server.
            */
            //console.log(theImg.src);
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

// calculate age
// refered from http://www.romcartridge.com/2010/01/javascript-function-to-calculate-age.html
function calculateAge(birthMonth, birthDay, birthYear)
{
  todayDate = new Date();
  todayYear = todayDate.getFullYear();
  todayMonth = todayDate.getMonth();
  todayDay = todayDate.getDate();
  age = todayYear - birthYear;

  if (todayMonth < birthMonth - 1)
  {
    age--;
  }

  if (birthMonth - 1 == todayMonth && todayDay < birthDay)
  {
    age--;
  }
  return age;
}


/**
 *
 * Show profile function
 * update user_profile_page
 *
 */
function showProfile(username){
    window.socket.emit("get_user_info", username);

    socket.on("receive_user_info", function(user){
        /*
user:

        _id: "5530bb3903a7fcbc781440ba"
        birthday: "1994-03-30T06:00:00.000Z"
        gender: "Female"
        intro: ""
        location: ""
        profile_image: ""
        profile_wall_image: "default_profile_wall.jpg"
        username: "shd101wy

         */
        var username = user.username;
        // hide all other page and show profile page
        $(".page").hide();
        $("#user_profile_page").show();

        if (user.profile_image === ""){
            // show identicon if necessary
            var identicon_data = new Identicon(username.hashCode()+"", 420).toString();
            $("#profile_image").attr({"src": "data:image/png;base64," + identicon_data});
        }
        $("#profile_username").text(username); // set username

        // intro
        $("#profile_intro").text(user.intro);

        // age
        $("#profile_age").text(calculateAge(parseInt(user.birthday.slice(5, 7)),
                                            parseInt(user.birthday.slice(8, 10)),
                                            parseInt(user.birthday.slice(0, 5))));

        // gender
        $("#profile_gender").text(user.gender);

        // location
        $("#profile_location").text(user.location);

        // birthday
        $("#profile_birthday").text(user.birthday.slice(0, 10));

    });

    // change profile image
    socket.on("receive_user_profile_image_data", function(data){
        $("#profile_image").attr({"src": "data:image/png;base64," + data});
    });

    // change profile wall image
    socket.on("receive_user_profile_wall_image_data", function(data){
        $("#profile_wall_image").attr({"src": "data:image/png;base64," + data});
    });
}
