/**
 * Created by Administrator on 2014-04-12.
 */


var mongoose = require('mongoose');

var mongoTemplate = function(func) {
    mongoose.connect("mongodb://localhost/have_a_meal");

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open',func);
};

exports.getUser = function(name, email) {
    return mongoTemplate(
        function callback () {

           var userSchema = mongoose.Schema({
                name: String,
                email: String
            });
            var User = mongoose.model('user', userSchema);
            var user = new User({name: name, email: email});

            User.find({email: userinfo.emails[0].value}, function (err, users) {

                if (users.length === 0) {
                    user.save(function (err, user) {
                        if (err) return console.error(err);
                    });
                }


            });
        }
    );
}
