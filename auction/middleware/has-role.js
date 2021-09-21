const { StatusCodes } = require("http-status-codes");

const hasAdmin = (req, res, next) => {
    hasRole("Admin", res, next);
}

const hasUser = (req, res, next) => {
    hasRole("User", res, next);
}

const hasRole = (role, res, next) => {
    if (req.user.roles.indexOf(role.toLowerCase()) == -1) {
        return res.status(StatusCodes.UNAUTHORIZED).send(role + " role needed");
    }

    next();
}

module.exports = {
    hasAdmin
};