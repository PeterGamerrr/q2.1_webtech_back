const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const isLoggedIn = require("../middleware/is-logged-in");
const { hasAdmin } = require("../middleware/has-role");
let { auctions, counter, fields, fieldsToValidate } = require("../storage/auctions");
const {products} = require("../storage/products");


router.get("/", (req, res) => {
    let auctionsToSend = null;

    if (Object.keys(req.query).length === 0) {
        auctionsToSend = auctions;
    } else {
        auctionsToSend = auctions.filter(auction => {
            for (const [key, val] of Object.entries(req.query)) {
                if (auction[key] !== undefined && auction[key].toString().toLowerCase() !== val.toLowerCase()) {
                    return false;
                }
            }

            return true;
        })
    }

    res
        .status(StatusCodes.OK)
        .json(auctionsToSend);
});


router.get("/:id", (req, res) => {
    let id = req.params.id;
    let auction = auctions.find(auction => auction.id == id);
    if (auction === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Auction not found"});
    }

    res
        .status(StatusCodes.OK)
        .json(auction);
});


router.post("/", isLoggedIn, hasAdmin, (req, res) => {
    let newAuction = req.body;

    if (!checkAuctionValidity(newAuction, true)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Auction not valid"});
    }

    counter++;
    newAuction.id = counter;

    auctions.push(newAuction);
    res
        .status(StatusCodes.CREATED)
        .json(newAuction);
});


router.put("/:id", isLoggedIn, hasAdmin, (req, res) => {
    let id = req.params.id;

    let newAuction = req.body;
    if (!checkAuctionValidity(newAuction, true)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Auction not valid"});
    }

    let auction = auctions.find(auction => auction.id == id);
    if (auction === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Auction not found"});
    }

    fieldsToValidate.forEach(field => {
        if (newAuction[field] !== undefined) {
            auction[field] = newAuction[field];
        }
    });

    res
        .status(StatusCodes.OK)
        .json(auction);
});


router.patch("/:id", isLoggedIn, hasAdmin, (req, res) => {
    let id = req.params.id;

    let newAuction = req.body;
    if (!checkAuctionValidity(newAuction)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Auction not valid"});
    }

    let auction = auctions.find(auction => auction.id == id);
    if (auction === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Auction not found"});
    }

    fieldsToValidate.forEach(field => {
        if (newAuction[field] !== undefined) {
            auction[field] = newAuction[field];
        }
    });

    res
        .status(StatusCodes.OK)
        .json(auction);
});


router.delete("/:id", isLoggedIn, hasAdmin, (req, res) => {
    let id = req.params.id;

    let auctionIndex = auctions.findIndex(auction => auction.id == id);
    if (auctionIndex == -1) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Auction not found"});
    }
    let auction = auctions[auctionIndex];

    auctions.splice(auctionIndex, 1);

    res
        .status(StatusCodes.OK)
        .json(auction);
});

router.delete("/", isLoggedIn, hasAdmin, (req, res) => {
    if (process.env.NODE_ENV !== "dev") {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"This request can't be used in production."});
    }

    res
        .status(StatusCodes.OK)
        .json(auctions);

    auctions = [];
    counter = -1;
});


function checkAuctionValidity(auction, allFields = false) {
    let checkFields = {};
    fieldsToValidate.forEach(field => {
        checkFields[field] = false
    });

    for (const [key, val] of Object.entries(auction)) {
        checkFields[key] = true;

        if (key == "startPrice" && (
            typeof val !== "number" ||
            val <= 0)) {
            return false;
        } else if (key == "price" && (
            typeof val !== "number" ||
            val <= 0)) {
            return false;
        } else if (key == "startDate" && (
            typeof val !== "number" ||
            val <= 946681200000)) { // year 2000
            return false;
        } else if (key == "endDate" && (
            typeof val !== "number" ||
            val <= 946681200000)) { // year 2000
            return false;
        } else if (key == "productId" && (
            typeof val !== "number" ||
            val < 0 ||
            products.findIndex(product => product.id == val) === -1)) {
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
