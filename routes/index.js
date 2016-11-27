var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var User = require('../models/User');
var util = require('util');

/* GET home page. */
router.post('/login', function (req, res) {
    if (req.body.username == null || req.body.password == null) {
        return res.send({
            success: false,
            message: "Null username or password."
        })
    }

    User.findOne({
        username: req.body.username
    }, function (error, user) {
        if (error) {
            console.log(error);
            return res.send({
                success: false,
                message: error.message
            })
        }

        if (user == null) {
            console.log(error);
            return res.send({
                success: false,
                message: "Username not found."
            })
        }

        user.comparePassword(req.body.password, function (error, isMatch) {
            if (error) {
                return res.send({
                    success: false,
                    message: error.message
                });
            }

            if (!isMatch) {
                return res.send({
                    success: false,
                    message: "Wrong password."
                });
            } else {

                // create a token
                var token = jwt.sign(user, config.auth.SECRET, {
                    expiresIn: config.auth.EXP_TIME
                });

                return res.send({
                    success: true,
                    data: token,
                })
            }
        })
    })
});

router.post('/register', function (req, res) {
    if (req.body.username == null || req.body.password == null) {
        return res.send({
            success: false,
            message: "Null username or password."
        })
    }

    User.findOne({
        username: req.body.username
    }, function (error, user) {
        if (error) {
            console.log(error);
            return res.send({
                success: false,
                message: error.message
            })
        }

        if (user != null) {
            console.log(error);
            return res.send({
                success: false,
                message: "Username has been taken."
            })
        }

        var newUser = User({
            username: req.body.username,
            password: req.body.password
        });

        newUser.save(function (error, savedUser) {
            if (error) {
                return res.send({
                    success: false,
                    message: error.message
                });
            }

            // create a token
            var token = jwt.sign(savedUser, config.auth.SECRET, {
                expiresIn: config.auth.EXP_TIME
            });

            return res.send({
                success: true,
                data: token,
            })
        });
    })
});

//middleware for authorization
router.use(function (req, res, next) {

    //get token from body or header
    var token = req.headers['token'] || req.body.token;
    if (token) {


        //verifies secret and check exp
        jwt.verify(token, config.auth.SECRET, function (err, decoded) {
            if (err) {
                console.log(err);
                return res.status(401).send({
                    success: false,
                    message: err.message
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.user = decoded._doc;

                next();
            }
        })
    } else {

        //there is no token
        return res.status(401).send({
            success: false,
            message: "No token provided"
        })
    }
});

router.use('/users', require('./users'));

module.exports = router;
