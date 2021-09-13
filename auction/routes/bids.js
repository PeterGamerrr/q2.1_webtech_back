const express = require("express");
const router = express.Router();
const StatusCodes = require("http-status-codes");
let bids = require("../storage/bids")

router.get("/", (req, res) => {
    res
        .status(StatusCodes.OK)
        .send(bids);
})

module.exports = router;
