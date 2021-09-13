const express = require('express');
const router = express.Router();
const StatusCodes = require("http-status-codes");
let products = require("../storage/products")

router.get('/', async (req, res) => {
    try {
        console.log("read products.js")
        await res.status(StatusCodes.OK)
    } catch (e) {
        console.error(e);
        await res.status(StatusCodes.BAD_REQUEST)
    }
    res.send(products);
})

router.get("/:id" , async (req, res) => {
    let id = req.query.id;
})

module.exports = router;
