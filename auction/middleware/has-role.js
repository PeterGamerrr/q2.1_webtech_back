const { StatusCodes } = require("http-status-codes");

const hasAdmin = (req, res, next) => {
    hasRole("admin", req, res, next);
}

const hasUser = (req, res, next) => {
    hasRole("user", req, res, next);
}

const isSelfOrAdmin = (req, res, next) => {
    let id = req.params.id;
    if (req.user.id !== id && !req.user.roles.includes("admin")) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({error:"Not authorized"});
    }

    next();
}

const hasRole = (role, req, res, next) => {
    if (!req.user.roles.includes(role)) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({error:role + " role needed"});
    }

    next();
}

module.exports = {
    hasAdmin,
    hasUser,
    isSelfOrAdmin
};