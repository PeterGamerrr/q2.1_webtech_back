const express = require("express");
const router = express.Router();
const debug = require("debug")("auction:server");
const fs = require("fs");
const {StatusCodes} = require("http-status-codes");


router.get("/", (req, res) => {
    let users;
    try {
        users = require("../storage/users");
        res.status(StatusCodes.OK);
    } catch (e) {
        res.status(StatusCodes.BAD_REQUEST);
    }
    res.send(users);
});

module.exports = router;
