const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
            if (err) {
                res.redirect('/login');
            } else {
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
};

const checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, SECRET_KEY, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null; 
                next();
            } else {
                try {
                    let user = await User.findById(decodedToken.id);
                    res.locals.user = user; 
                    next();
                } catch (error) {
                    console.log(error.message);
                    next();
                }
            }
        });
    } else {
        res.locals.user = null; 
        next();
    }
};





module.exports = { requireAuth, checkUser };
