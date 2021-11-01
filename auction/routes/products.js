const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const isLoggedIn = require("../middleware/is-logged-in");
const { hasAdmin } = require("../middleware/has-role");
let { products, counter,fields ,fieldsToValidate } = require("../storage/products");


router.get("/", (req, res) => {
    let productsToSend = null;

    if (Object.keys(req.query).length === 0) {
        productsToSend = products;
    } else {
        productsToSend = products.filter(product => {
            for (const [key, val] of Object.entries(req.query)) {
                if (product[key] !== undefined && product[key].toString().toLowerCase() !== val.toLowerCase()) {
                    return false;
                }
            }

            return true;
        })
    }

    res
        .status(StatusCodes.OK)
        .json(productsToSend);
});


router.get("/:id", (req, res) => {
    let id = req.params.id;
    let product = products.find(product => product.id == id);
    if (product === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Product not found"});
    }

    res
        .status(StatusCodes.OK)
        .json(product);
});


router.post("/", isLoggedIn, hasAdmin, (req, res) => {
    let newProduct = req.body;

    if (!checkProductValidity(newProduct, true)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Product not valid"});
    }

    counter++;
    newProduct.id = counter;

    products.push(newProduct);
    res
        .status(StatusCodes.CREATED)
        .json(newProduct);
});


router.put("/:id", isLoggedIn, hasAdmin, (req, res) => {
    let id = req.params.id;

    let newProduct = req.body;
    if (!checkProductValidity(newProduct, true)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({err:"Product not valid"});
    }

    let product = products.find(product => product.id == id);
    if (product === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({err:"Product not found"});
    }

    fieldsToValidate.forEach(field => {
        if (newProduct[field] !== undefined) {
            product[field] = newProduct[field];
        }
    });

    res
        .status(StatusCodes.OK)
        .json(product);
});


router.patch("/:id", isLoggedIn, hasAdmin, (req, res) => {
    let id = req.params.id;

    let newProduct = req.body;
    if (!checkProductValidity(newProduct)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Product not valid"});
    }

    let product = products.find(product => product.id == id);
    if (product === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Product not found"});
    }

    fieldsToValidate.forEach(field => {
        if (newProduct[field] !== undefined) {
            product[field] = newProduct[field];
        }
    });

    res
        .status(StatusCodes.OK)
        .json(product);
});


router.delete("/:id", isLoggedIn, hasAdmin, (req, res) => {
    let id = req.params.id;

    let productIndex = products.findIndex(product => product.id == id);
    if (productIndex == -1) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Product not found"});
    }
    let product = products[productIndex]

    products.splice(productIndex, 1);

    res
        .status(StatusCodes.OK)
        .json(product);
});

router.delete("/", isLoggedIn, hasAdmin, (req, res) => {
    if (process.env.NODE_ENV !== "dev") {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"This request can't be used in production."});
    }

    res
        .status(StatusCodes.OK)
        .json(products);

    products = [];
    counter = -1;
});


function checkProductValidity(product, allFields = false) {
    let checkFields = {};
    fieldsToValidate.forEach(field => {
        checkFields[field] = false
    });

    for (const [key, val] of Object.entries(product)) {
        checkFields[key] = true;

        if (key == "name" && (
            typeof val !== "string" ||
            val.length < 3 ||
            val.length > 128)) {
            return false;
        } else if (key == "brand" && (
            typeof val !== "string" ||
            val.length <= 0 ||
            val.length > 128)) {
            return false;
        } else if (key == "region" && (
            typeof val !== "string" ||
            val.length <= 0 ||
            val.length > 128)) {
            return false;
        } else if (key == "capacity" && (
            typeof val !== "number" ||
            val <= 0)) {
            return false;
        } else if (!fields.includes(key)) {
            return false;
        }
    }

    if (allFields) {
        for (const val of Object.values(checkFields)) {
            if (!val) {
                return false;
            }
        }
    }

    return true;
}

module.exports = router;
