const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const isLoggedIn = require("../middleware/is-logged-in");
const { hasAdmin, isSelfOrAdmin} = require("../middleware/has-role");
let { fields, bids, counter, fieldsToValidate} = require("../storage/bids");
let {auctions} = require("../storage/auctions");


setInterval(() => {
    let prevAuctionIds = [];
    for (let i=0; i<bids.length; i++) {
        let auctionId = bids[i].auctionId;
        if (prevAuctionIds.includes(auctionId))
            continue;
        prevAuctionIds.push(auctionId);

        let auction = auctions.find(a => a.id == auctionId);
        if (!auction || auction.endDate > Date.now())
            continue;

        let bidsOfAuction = bids.filter(b => b.auctionId == auctionId);
        if (bidsOfAuction.find(b => b.hasWon))
            continue;

        let highestBid = bidsOfAuction[0];
        bidsOfAuction.forEach(b => {
            if (highestBid.price < b.price)
                highestBid = b;
        })
        highestBid.hasWon = true;
    }
}, 1000);


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
        .json(bidsToSend);
});


router.get("/:id", (req, res) => {
    let id = req.params.id;
    let bid = bids.find(bid => bid.id == id);
    if (bid === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Bid not found"});
    }

    res
        .status(StatusCodes.OK)
        .json(bid);
});


router.post("/", isLoggedIn, (req, res) => {
    let newBid = req.body;

    if (!checkBidValidity(newBid, true)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Bid not valid"});
    }

    let msg = checkAuction(newBid);
    if (msg) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({msg});
    }

    counter++;
    newBid.id = counter;
    newBid.userId = req.user.id;
    newBid.hasWon = false;
    newBid.date = Date.now();

    bids.push(newBid);
    res
        .status(StatusCodes.CREATED)
        .json(newBid);
});


router.delete("/:id", isLoggedIn, (req, res) => {
    let id = req.params.id;

    let bidIndex = bids.findIndex(bid => bid.id == id);
    if (bidIndex == -1) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Bid not found"});
    }
    let bid = bids[bidIndex];

    if (bid.userId != req.user.id) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .send("Not authorized");
    }

    bids.splice(bidIndex, 1);

    res
        .status(StatusCodes.OK)
        .json(bid);
});

router.delete("/", isLoggedIn, hasAdmin, (req, res) => {
    if (process.env.NODE_ENV !== "dev") {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"This request can't be used in production."});
    }

    res
        .status(StatusCodes.OK)
        .json(bids);

    bids = [];
    counter = -1;
});


function checkAuction(bid) {
    let auction = auctions.find(auction => auction.id == bid.auctionId);
    if (!auction)
        return "The auction of the bid doesn't exist.";

    if (auction.endDate <= Date.now())
        return "The auction has ended already.";

    if (auction.startDate > Date.now())
        return "The auction hasn't started yet.";

    if (bids.filter(b => b.auctionId == bid.auctionId)
        .find(b => b.price >= bid.price))
        return "Someone already bid higher than you.";
}


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
        } else if (key == "auctionId" && (
            typeof val !== "number" ||
            val < 0)) {
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
