
// Check user name valid ?
function usernameValid(username){
    return /^[0-9a-zA-Z_.-]+$/.test(username);
}

// check user password valid ?
function userpasswordValid(password){
    return /^[$!@#$%^&*()0-9a-zA-Z_.-]+$/.test(password);
}

module.exports = {
    usernameValid: usernameValid,
    userpasswordValid: userpasswordValid
};
