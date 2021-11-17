const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constant = require('../util/constant.json')
const session = require('express-session');


// API for registration
router.post('/v1/register', (req, res) => {
    let result;
    if (!req.body.user_id) {
        result = {
            status: false,
            message: "UserID cannot be NULL"
        }
        res.status(400).send(result);
    }

    if (!req.body.password) {
        result = {
            status: false,
            message: "Password cannot be NULL"
        }
        res.status(400).send(result);
    }

    bcrypt.hash(req.body.password, 10).then(pass => {
        let reqData = {
            user_id: req.body.user_id,
            password: pass
        }

        User.create(reqData).then((data) => {
            result = {
                status: true,
                message: `Registration success with ID ${data.user_id}`,
                data: {
                    user_id: data.user_id
                }
            }
            res.status(200).send(result);
        }).catch(error => {
            result = {
                status: false,
                message: `Error: ${error}`
            }
            res.status(500).send(result);
        })
    })
});

// API for login
router.post('/v1/login', (req, res) => {
    let result;
    if (!req.body.user_id) {
        result = {
            status: false,
            message: "User ID cannot be null"
        }
        res.status(400).send(result);
    }

    if (!req.body.password) {
        result = {
            status: false,
            message: " Password cannot be null"
        }
        res.status(400).send(result);
    }

    User.findOne({
        where: {
            user_id: req.body.user_id
        }
    }).then(value => {
        bcrypt.compare(req.body.password, value.password).then(result => {
            if (!result) {
                var resObj = {
                    status: false,
                    message: "Incorrect password"
                }
                res.status(400).send(resObj);
            }
        });
        let payload_data = {
            user_id: value.user_id
        }

        const token = jwt.sign({ payload_data }, constant.jwtSecretKey, { expiresIn: "1h" });

        result = {
            status: true,
            message: "Login Success",
            token: token,
            data: {
                user_id: value.user_id
            }
        }

        res.status(200).send(result);
        
        req.session.user_id = user_id;
        req.session.save();

    }).catch(err => {
        result = {
            status: false,
            message: `Error : ${err}`
        }
        res.status(500).send(result);
    })
});

// API for password change
router.post('/v1/passwordChange', (req, res) => {
    let result;
    if (!req.body.user_id) {
        result = {
            status: false,
            message: "UserID cannot be NULL"
        }
        res.status(400).send(result);
    }

    if (!req.body.password) {
        result = {
            status: false,
            message: "Password cannot be NULL"
        }
        res.status(400).send(result);
    }

    bcrypt.hash(req.body.password, 10).then(pass => {

        User.update({password: pass}, {where : {user_id: req.body.user_id}}).then((data) => {
            console.log(data)
            result = {
                status: true,
                message: `Password Update success with ID ${req.body.user_id}`,
                data: {
                    user_id: req.body.user_id
                }
            }
            res.status(200).send(result);
        }).catch(error => {
            result = {
                status: false,
                message: `Error: ${error}`
            }
            res.status(500).send(result);
        })
    })
});




module.exports = router;