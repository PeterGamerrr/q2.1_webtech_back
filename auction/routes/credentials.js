const express = require("express");
const { StatusCodes } = require("http-status-codes");
const users = require("../data/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

const login = (username, password) => {
    const user = users.find((user) => {
        return user.username === username;
    })
    if (!user) {
        return false;
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return false;
    }

    return jwt.sign(
        {
            username: user.username,
            roles: user.roles
        },
        user.secret
    );
};

router.post("", (req, res) => {
    const { username, password } = req.body;
    if (!username) {
        return res.status(StatusCodes.BAD_REQUEST).send("Username missing in body");
    } else if (!password) {
        return res.status(StatusCodes.BAD_REQUEST).send("Password missing in body");
    }

    const token = login(username, password);
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).send("Username or password incorrect");
    }

    res.status(StatusCodes.CREATED).send({
        token: token
    });
});

module.exports = router;