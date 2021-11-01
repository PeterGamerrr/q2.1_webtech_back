const express = require("express");
const { StatusCodes } = require("http-status-codes");
const { users } = require("../storage/users");
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
            email: user.email,
            id: user.id,
            username: user.username,
            roles: user.roles
        },
        user.secret
    );
};

router.post("", (req, res) => {
    const { username, password } = req.body;
    if (!username) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Username missing in body"});
    } else if (!password) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Password missing in body"});
    }

    const token = login(username, password);
    if (!token) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({error:"Username or password incorrect"});
    }

    res
        .status(StatusCodes.CREATED)
        .json({
            token: token
        });
});

module.exports = router;