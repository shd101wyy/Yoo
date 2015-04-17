(function(){
    function assertEqual(a, b) {
        if (a !== b) {
            throw new Error('values are not equal. Expected: ' + a + "  Given: " + b);
        }
    }

    function assertNotEqual(a, b) {
        if (a === b) {
            throw new Error('values are equal. Expected: ' + a + "  Given: " + b);
        }
    }
    // b in a
    function assertIn(a, b){
        if (!(b in a)){
            throw new Error(b + " not in " + a);
        }
    }

    // test string hashCode function
    // function from profile.js
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

    assertEqual("shd101wyy".hashCode(), "shd101wyy".hashCode());
    assertEqual("asdfsadfsadf".hashCode(), "asdfsadfsadf".hashCode());
    assertEqual("!@U*(@#!U*())".hashCode(), "!@U*(@#!U*())".hashCode());
    assertEqual("ZXCMKL:".hashCode(), "ZXCMKL:".hashCode());
    assertEqual("123456789".hashCode(), "123456789".hashCode());

    assertNotEqual("shd101wyy".hashCode(), "shd101wy".hashCode());
    assertNotEqual("abc".hashCode(), "_bc".hashCode());
    assertNotEqual("ywang189".hashCode(), "ywang188".hashCode());
    assertNotEqual("shd101wyy".hashCode(), "shd101wyY".hashCode());




})();
