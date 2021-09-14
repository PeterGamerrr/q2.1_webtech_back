const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
let { auctions, counter } = require("../storage/auctions");

router.get("/", (req, res) => {
    res
        .status(StatusCodes.OK)
        .send(auctions);
});

module.exports = router;
