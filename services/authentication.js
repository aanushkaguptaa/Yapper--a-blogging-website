const JWT = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRETENV;

function createTokenForUser(user){
    const payload= {
        _id: user._id,
        email: user.email,
        username: user.fullName,
        pfp: user.profileImageURL,
        role: user.role,
    };
    const token= JWT.sign(payload, secret);
    return token;
}

function validateToken(token){
    const payload= JWT.verify(token, secret);
    return payload;
}

module.exports= {
    createTokenForUser,
    validateToken,
}