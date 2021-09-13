const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
let products = require("../storage/products")

router.get("/", (req, res) => {
    res
        .status(StatusCodes.OK)
        .send(products);
});

router.get("/:id" , async (req, res) => {
    let id = req.query.id;
});

module.exports = router;
