var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, index: true},
    password: String,
    fullName: {
        type: String,
        default: ""
    },
    score: {
        type: Number,
        default: 0
    },
});

userSchema.pre('save', function(next) {



    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {

        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;


            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
