const express = require('express');
const router = express.Router();
const StatusCodes = require("http-status-codes");

router.get('/', async (req, res) => {
    let products;
    try {
        products = require("../storage/products")
        console.log("read products.js")
        await res.status(StatusCodes.OK)
    } catch (e) {
        console.error(e);
        await res.status(StatusCodes.BAD_REQUEST)
    }
    res.send(products);
})

router.get("/:id" , async (req, res) => {
    req.query.id
})

module.exports = router;
