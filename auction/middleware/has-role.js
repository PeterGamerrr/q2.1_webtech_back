const { StatusCodes } = require("http-status-codes");

const hasAdmin = (req, res, next) => {
    hasRole("Admin", req, res, next);
}

const hasUser = (req, res, next) => {
    hasRole("User", req, res, next);
}

const hasRole = (role, req, res, next) => {
    if (req.user.roles.indexOf(role.toLowerCase()) === -1) {
        return res.status(StatusCodes.UNAUTHORIZED).send(role + " role needed");
    }

    next();
}

module.exports = {
    hasAdmin,
    hasUser
};