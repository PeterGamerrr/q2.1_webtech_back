const express = require('express');
const fs = require("fs");
const util = require("util");
const router = express.Router();
const StatusCodes = require("http-status-codes");

const readFilePromise = util.promisify(fs.readFile);


router.get('/', async (req, res) => {
    let products;
    try {
        products = await readFilePromise('./storage/products.json');
        products = JSON.parse(products);
        console.log("read products.json")
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
