const express = require('express');
const router = express.Router();
const StatusCodes = require("http-status-codes");
let auctions = require("../storage/auctions")

router.get('/', (req, res) => {
    res.status(StatusCodes.OK)
    console.error(e);
    res.send(auctions);
})


module.exports = router;
