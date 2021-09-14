const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
let products = require("../storage/products");

router.get("/", (req, res) => {
    if (Object.keys(req.query).length === 0) {
        res
            .status(StatusCodes.OK)
            .send(products);
    } else {
        let region = req.query.region.toLowerCase();
        let brand = req.query.brand.toLowerCase();
        let capacity = req.query.capacity.toLowerCase();
        console.log({region,brand,capacity});
        let filteredProducts = products.filter(element => {
            let out = true;
            if (region !== undefined && element.region.toLowerCase() !== region) {
                out = false;
                console.log({"wrong region ": element.region.toLowerCase()});
            }
            if (brand !== undefined && element.brand.toLowerCase() !== brand) {
                out = false;
                console.log({"wrong brand " : element.brand.toLowerCase()})
            }
            if (capacity !== undefined && element.capacity.toString() !== capacity) {
                out = false;
                console.log({"wrong capacity " : element.capacity.toString()})
            }
            return out;
        })
        res
            .status(StatusCodes.OK)
            .send(filteredProducts);
    }
});

router.get("/:id", (req, res) => {
    let id = req.params.id;
    res
        .status(StatusCodes.OK)
        .send(products.find(element => element.id == id));
});

module.exports = router;
