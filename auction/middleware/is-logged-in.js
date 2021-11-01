const { StatusCodes } = require("http-status-codes");
const { users } = require("../storage/users");
const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
    const token = getTokenFromRequest(req);
    if (!token) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({error:"Token missing in authorization header"});
    }

    const payload = verifyToken(token);
    if (!payload) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({error:"Token invalid"});
    }

    req.user = users.find(user => user.id === payload.id);
    return next();
}

const getTokenFromRequest = (req) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return false;
    }

    return authHeader.split(" ")[1];
}

const verifyToken = (token) => {
    const payload = jwt.decode(token);
    if (!payload) {
        return false;
    }

    const user = users.find(user => user.id == payload.id);
    if (!user) {
        return false;
    }

    try {
        return jwt.verify(token, user.secret);
    } catch (ex) { }

    return false;
}

module.exports = isLoggedIn;