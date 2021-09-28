const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const isLoggedIn = require("../middleware/is-logged-in");
const { hasAdmin } = require("../middleware/has-role");
let { fields, bids, counter, fieldsToValidate} = require("../storage/bids");
const {auctions} = require("../storage/auctions");


router.get("/", (req, res) => {
    let bidsToSend = null;

    if (Object.keys(req.query).length === 0) {
        bidsToSend = bids;
    } else {
        bidsToSend = bids.filter(bid => {
            for (const [key, val] of Object.entries(req.query)) {
                if (bid[key] && bid[key].toLowerCase() !== val.toLowerCase()) {
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


router.post("/", isLoggedIn ,(req, res) => {
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


    res
        .status(StatusCodes.CREATED)
        .send(newBid);
});

router.delete("/:id", isLoggedIn, (req, res) => {
    let id = req.params.id;
    if (req.user.id !== id && !req.user.roles.includes("admin")) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .send("Not authorized");
    }

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
        }
        else if (key == "auctionId" && (
            typeof val !== "number" ||
            val < 0 ||
            auctions.findIndex(auction => auction.id == val) === -1 )) {
            return false;
        }

        else if (!fields.includes(key)) {
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
