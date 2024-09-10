const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, userID) => {
    const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    res.cookie('token ', token, {
        httpOnly: true, // prevent xss Attacks
        secure: process.env.NODE_ENV === "Production",
        sameSite: 'strict', // prevent csrf Attacks
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return token;
}

module.exports = generateTokenAndSetCookie;