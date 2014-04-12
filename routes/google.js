
/*
 * GET google AUth
 */

var request = require("request");
var mongo = require('./mongo');
var GoogleAPI = function (){

    var authURL = "https://accounts.google.com/o/oauth2/auth?scope=email%20profile&redirect_uri=http://localhost:3000/google/callback&response_type=code&client_id=485446617602.apps.googleusercontent.com";
    var tokenURL = "https://accounts.google.com/o/oauth2/token",
         client_id = "485446617602.apps.googleusercontent.com",
         client_secret = "FHCOcSKfKKWcDCeWplOevNPo",
         redirect_uri = "http://localhost:3000/google/callback",
         grant_type = "authorization_code",
         accessTokenURL = "https://www.googleapis.com/plus/v1/people/me?access_token=",
         callback;

    var sendTokenCallback = function(err, response, body) {
        if(err && response.statusCode !== 200) {
            console.log('Request error.');
        }

        var result = JSON.parse(body);
        request({url : accessTokenURL + result.access_token}, getUserData);
    };

    var getUserData = function(err, response, body) {
        var userinfo = JSON.parse(body);

        if(err && response.statusCode !== 200) {
            console.log('Request error.');
        }

        callback(userinfo);
    };

    return {
        getAuthURL : function() {
            return authURL;
        },
        sendToken : function(code) {

            request.post({ url: tokenURL, form: {
                code: code,
                client_id: client_id,
                client_secret: client_secret,
                redirect_uri: redirect_uri,
                grant_type: grant_type
            }}, sendTokenCallback);

            return {
                callback : function(fu) {
                    callback = fu;
                }
            }
        }
    }
};

var googleAPI = new GoogleAPI();

exports.auth = function(req, res){
    res.redirect(googleAPI.getAuthURL());
};

exports.callback = function(req, res) {

    var code = req.query.code;
    googleAPI.sendToken(code).callback(function(userData) {
        console.log(userData);
        var user = mongo.getUser(userData.displayName, userData.emails[0].value);
        res.send(user);
    });
}