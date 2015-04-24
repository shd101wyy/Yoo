// I will change schema in the future.
// So no need to do unittest now

//
// test database
//
(function(){
    function assertEqual(a, b) {
        if (a !== b) {
            throw new Error('values are not equal. Expected: ' + a + "  Given: " + b);
        }
    }
    // b in a
    function assertIn(a, b){
        if (!(b in a)){
            throw new Error(b + " not in " + a);
        }
    }

    /* ###############################################
     * test User Schema
     * ###############################################
     */
    var db_User = require("../database/UserSchema.js");
    // test save user
    var username = "abcdefghijklmnopqrstuvwxyz";
    // test without password
    // should output error
    var user = db_User({
        username : username,
    });
    user.save(function(err){
        if (err){
            return;
        }
        else{
            throw "ERROR: user password required";
        }
    });

    // test save
    user = db_User({
        username: username,
        password: "sadsaldfmkasld;gmkl;asdgmkl;a"
    });
    user.save(function(err){
        if (err){
            throw "ERROR: failed to save user to database";
        }
        else{
            //console.log("User " + username + " saved");
            // test save user with same username
            // which should not be allowed
            var user2 = db_User({
                username: username,
                password: "dsa;fmasl;dfmksal;dfmlsa;dfafd"
            });
            user2.save(function(err){
                if (err){
                    //console.log("User " + username + " removed");
                    console.log("** Passed User Schema test");
                    user.remove();
                    return;
                }
                else{
                    throw "ERROR: User schema shouldn't allow same usernames";
                }
            });
        }
    });

    /* ###############################################
     * test Post Schema
     * ###############################################
     */
    var db_Post = require("../database/PostSchema.js");

    // test missing information
    // should cause error
    var post = db_Post({
        // username: "asdklfndjksalfn",
        data: "amskdfl;asdmfkl;sdakl;f",
        type: "sdkl;fmask;lfmkasl;mfkl;asdfm",
        longitude: 123,
        latitude: 123,
        lon_region: 123,
        lat_region: 123
    });
    post.save(function(err){
        if (err){
            return;
        }
        throw "ERROR: failed to pass Post schema test";
    });

    post = db_Post({
        username: "asdklfndjksalfn",
        //data: "amskdfl;asdmfkl;sdakl;f",
        type: "sdkl;fmask;lfmkasl;mfkl;asdfm",
        longitude: 123,
        latitude: 123,
        lon_region: 123,
        lat_region: 123
    });
    post.save(function(err){
        if (err){
            return;
        }
        throw "ERROR: failed to pass Post schema test";
    });

    post = db_Post({
        username: "asdklfndjksalfn",
        data: "amskdfl;asdmfkl;sdakl;f",
        //type: "sdkl;fmask;lfmkasl;mfkl;asdfm",
        longitude: 123,
        latitude: 123,
        lon_region: 123,
        lat_region: 123
    });
    post.save(function(err){
        if (err){
            return;
        }
        throw "ERROR: failed to pass Post schema test";
    });

    post = db_Post({
        username: "asdklfndjksalfn",
        data: "amskdfl;asdmfkl;sdakl;f",
        type: "sdkl;fmask;lfmkasl;mfkl;asdfm",
        //longitude: 123,
        latitude: 123,
        lon_region: 123,
        lat_region: 123
    });
    post.save(function(err){
        if (err){
            return;
        }
        throw "ERROR: failed to pass Post schema test";
    });

    post = db_Post({
        username: "asdklfndjksalfn",
        data: "amskdfl;asdmfkl;sdakl;f",
        type: "sdkl;fmask;lfmkasl;mfkl;asdfm",
        longitude: 123,
        //latitude: 123,
        lon_region: 123,
        lat_region: 123
    });
    post.save(function(err){
        if (err){
            return;
        }
        throw "ERROR: failed to pass Post schema test";
    });


    post = db_Post({
        username: "asdklfndjksalfn",
        data: "amskdfl;asdmfkl;sdakl;f",
        type: "sdkl;fmask;lfmkasl;mfkl;asdfm",
        longitude: 123,
        latitude: 123,
        //lon_region: 123,
        lat_region: 123
    });
    post.save(function(err){
        if (err){
            return;
        }
        throw "ERROR: failed to pass Post schema test";
    });

    post = db_Post({
        username: "asdklfndjksalfn",
        data: "amskdfl;asdmfkl;sdakl;f",
        type: "sdkl;fmask;lfmkasl;mfkl;asdfm",
        longitude: 123,
        latitude: 123,
        lon_region: 123,
        //lat_region: 123
    });
    post.save(function(err){
        if (err){
            return;
        }
        throw "ERROR: failed to pass Post schema test";
    });

    // this one should be saved
    post = db_Post({
        username: "asdklfndjksalfn",
        data: "amskdfl;asdmfkl;sdakl;f",
        type: "sdkl;fmask;lfmkasl;mfkl;asdfm",
        longitude: 123,
        latitude: 123,
        lon_region: 123,
        lat_region: 123
    });
    post.save(function(err){
        if (err){
            throw "ERROR: failed to pass Post schema test";
        }
        else{
            post.remove();
            console.log("** Passed Post Schema test");
        }
    });



    /* #############################
     * test PostLike Schema
     * #############################
     */
    var db_PostLike = require("../database/PostLikeSchema.js");
    var post_like = db_PostLike({
        post_id: "sndaksdnfkas;dfmk;a",
        username: "asdkal;sfdm"
    });
    post_like.save(function(err){
        if (err){
            throw "ERROR: failed to pass PostLike schema test";
        }
        else{
            console.log("** Passed Post Schema test");
            post_like.remove();
        }
    });
})();
