const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
let products = require("../storage/products");

router.get("/", (req, res) => {
    res
        .status(StatusCodes.OK)
        .send(products);
});

router.get("/:id", (req, res) => {
    let id = req.params.id;
    res.send(products.find(element => element.id == id));
});

module.exports = router;
