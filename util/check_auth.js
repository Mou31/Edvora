const jwt = require('jsonwebtoken');
const config = require('../config.json')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, config.jwtSecretKey);
        next();
    } catch (error) {
        res.status(401).json({ 
            status : false,
            message: "Auth failed!",
            error: error 
        });
    }
}