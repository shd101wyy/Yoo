// 
// test sanitize string functionality
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

    var sanitize = require("../js/SanitizeString.js");
    // test username
    assertEqual(true, sanitize.usernameValid("shd101wyy"));
    assertEqual(true, sanitize.usernameValid("ywang189"));
    assertEqual(false, sanitize.usernameValid("var x = 12"));
    assertEqual(false, sanitize.usernameValid("'; SELECT * FROM table; --"));

    // test user password
    assertEqual(true, sanitize.userpasswordValid("4rfv5tgSASD"));
    assertEqual(true, sanitize.userpasswordValid("sadkl@MSKADL!"));
    assertEqual(true, sanitize.userpasswordValid("1234"));
    assertEqual(true, sanitize.userpasswordValid("$))(@#)"));
    assertEqual(false, sanitize.userpasswordValid("var x = 20"));
    assertEqual(false, sanitize.userpasswordValid("3 + 4"));
    assertEqual(false, sanitize.userpasswordValid("'; SELCET name from bank; --"));
})();
