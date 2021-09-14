// noinspection ExceptionCaughtLocallyJS

const express = require("express");
const router = express.Router();
const {StatusCodes} = require("http-status-codes");
let {products, counter} = require("../storage/products");

router.get("/", (req, res) => {
    if (Object.keys(req.query).length === 0) {
        res
            .status(StatusCodes.OK)
            .send(products);
    } else {
        let region = req.query.region.toLowerCase();
        let brand = req.query.brand.toLowerCase();
        let capacity = parseInt(req.query.capacity);
        console.log({region, brand, capacity});
        let filteredProducts = products.filter(element => {
            let out = true;
            if (region !== undefined && element.region.toLowerCase() !== region) {
                out = false;
                console.log({"wrong region ": element.region.toLowerCase()});
            }
            if (brand !== undefined && element.brand.toLowerCase() !== brand) {
                out = false;
                console.log({"wrong brand ": element.brand.toLowerCase()})
            }
            if (capacity !== undefined && element.capacity() !== capacity) {
                out = false;
                console.log({"wrong capacity ": element.capacity})
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

router.post("/", (req, res) => {
    let name, startPrice, endDate, region, brand, capacity;
    try {
        if (
            typeof req.body.name === "string" &&
            req.body.name.length < 128
        ) {
            name = req.body.name;
        } else {
            throw new Error("Name incorrect!");
        }

        if (
            typeof req.body.startPrice === "number" &&
            req.body.startPrice > 0
        ) {
            startPrice = req.body.name;
        } else {
            throw new Error("StartPrice incorrect!");
        }

        if (
            typeof req.body.endDate === "number" &&
            req.body.endDate > 0
        ) {
            endDate = req.body.endDate;
        } else {
            throw new Error("EndDate incorrect!");
        }

        if (
            typeof req.body.region === "string"
        ) {
            region = req.body.region;
        } else {
            throw new Error("Region incorrect!");
        }

        if (
            typeof req.body.brand === "string"
        ) {
            brand = req.body.brand;
        } else {
            throw new Error("Brand incorrect!");
        }

        if (
            typeof req.body.capacity === "number" &&
            parseInt(req.body.capacity) > 0
        ) {
            capacity = req.body.ca;
        } else {
            throw new Error("Capacity is incorrect")
        }

        counter++
        let product = {
            id: counter,
            name: name,
            endDate: endDate,
            region: region,
            brand: brand,
            capacity: capacity
        }
        products.push(product);
        res
            .status(StatusCodes.OK)
            .json(product)
    } catch (e) {
        res.status(StatusCodes.BAD_REQUEST);
        res.send(e.toString())
    }


})

module.exports = router;
