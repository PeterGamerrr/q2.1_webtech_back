const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const users = require("../storage/users");

router.get("/", (req, res) => {
    res
        .status(StatusCodes.OK)
        .send(users);
});

module.exports = router;
