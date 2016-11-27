var express = require('express');
var router = express.Router();
var _ = require('lodash');
var User = require('../models/User');

/* GET users listing. */
router.get('/', function (req, res) {
    User.find({}).sort({
        score: -1
    }).exec(function (error, users) {
        if (error) {
            console.log(error);
            return res.send({
                success: false,
                message: error.message
            })
        }

        return res.send({
            success: true,
            data: _.map(users, function (user) {
                return _.omit(user, ['password']);
            })
        })
    });
});

router.put('/updateScore', function (req, res) {
    if (req.body.score == null) {
        return res.send({
            success: false,
            message: "Invalid score."
        })
    }


    User.findById(req.user._id, function (error, user) {
        if (error) {
            console.log(error);
            return res.send({
                success: false,
                message: error.message
            })
        }

        user.score = req.body.score;

        user.save(function (error) {
            if (error) {
                console.log(error);
                return res.send({
                    success: false,
                    message: error.message
                })
            }

            return res.send({
                success: true,
                message: "Save score successfully!"
            })
        });
    })
});

module.exports = router;
