const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const isLoggedIn = require("../middleware/is-logged-in");
const { hasAdmin, isSelfOrAdmin} = require("../middleware/has-role");
let { fields, bids, counter, fieldsToValidate} = require("../storage/bids");
const {auctions} = require("../storage/auctions");
const {users} = require("../storage/users");


router.get("/", (req, res) => {
    let bidsToSend = null;

    if (Object.keys(req.query).length === 0) {
        bidsToSend = bids;
    } else {
        bidsToSend = bids.filter(bid => {
            for (const [key, val] of Object.entries(req.query)) {
                if (bid[key] !== undefined && bid[key].toString().toLowerCase() !== val.toLowerCase()) {
                    return false;
                }
            }

            return true;
        })
    }

    res
        .status(StatusCodes.OK)
        .send(bidsToSend);
});


router.get("/:id", (req, res) => {
    let id = req.params.id;
    let bid = bids.find(bid => bid.id == id);
    if (bid === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("Bid not found");
    }

    res
        .status(StatusCodes.OK)
        .send(bid);
});


router.post("/", isLoggedIn, isSelfOrAdmin, (req, res) => {
    let newBid = req.body;

    if (!checkBidValidity(newBid, true)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("Bid not valid");
    }

    counter++;
    newBid.id = counter;
    newBid.userId = req.user.id;
    newBid.hasWon = false;
    newBid.date = Date.now();

    bids.push(newBid);
    res
        .status(StatusCodes.CREATED)
        .send(newBid);
});


router.put("/:id", isLoggedIn, isSelfOrAdmin, (req, res) => {
    let id = req.params.id;

    let newBid = req.body;
    if (!checkBidValidity(newBid, true)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("Bid not valid");
    }

    let bid = bids.find(bid => bid.id == id);
    if (bid === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("Bid not found");
    }

    fieldsToValidate.forEach(field => {
        if (newBid[field] !== undefined) {
            bid[field] = newBid[field];
        }
    });

    res
        .status(StatusCodes.OK)
        .send(bid);
});


router.patch("/:id", isLoggedIn, isSelfOrAdmin, (req, res) => {
    let id = req.params.id;

    let newBid = req.body;
    if (!checkBidValidity(newBid)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("bid not valid");
    }

    let bid = bids.find(bid => bid.id == id);
    if (bid === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("bid not found");
    }

    fieldsToValidate.forEach(field => {
        if (newBid[field] !== undefined) {
            bid[field] = newBid[field];
        }
    });

    res
        .status(StatusCodes.OK)
        .send(bid);
});


router.delete("/:id", isLoggedIn, isSelfOrAdmin, (req, res) => {
    let id = req.params.id;

    let bidIndex = bids.findIndex(bid => bid.id == id);
    if (bidIndex == -1) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("Bid not found");
    }
    let bid = bids[bidIndex];

    bids.splice(bidIndex, 1);

    res
        .status(StatusCodes.OK)
        .send(bid);
});

router.delete("/", isLoggedIn, hasAdmin, (req, res) => {
    if (process.env.NODE_ENV !== "dev") {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("This request can't be used in production.");
    }

    res
        .status(StatusCodes.OK)
        .send(bids);

    bids = [];
    counter = -1;
});


function checkBidValidity(bid, allFields = false) {
    let checkFields = {};
    fieldsToValidate.forEach(field => {
        checkFields[field] = false
    });

    for (const [key, val] of Object.entries(bid)) {
        checkFields[key] = true;

        if (key == "price" && (
            typeof val !== "number" ||
            val < 0)) {
            return false;
        } else if (key == "hasWon" && (
            typeof val !== "boolean")) {
            return false;
        } else if (key == "date" && (
            typeof val !== "number" ||
            val <= 946681200000)) { // year 2000
            return false;
        } else if (key == "userId" && (
            typeof val !== "number" ||
            val < 0 ||
            users.findIndex(user => user.id == val) === -1 )) {
            return false;
        } else if (key == "auctionId" && (
            typeof val !== "number" ||
            val < 0 ||
            auctions.findIndex(auction => auction.id == val) === -1 )) {
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
