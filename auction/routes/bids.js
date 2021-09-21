const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const {v4:uuidv4} = require("uuid");
let { bids, counter } = require("../storage/users");


router.get("/", (req, res) => {
    res
        .status(StatusCodes.OK)
        .send(bids);
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


router.post("/", (req, res) => {
    let newBid = req.body;
    if (!checkBidValidity(newBid, true, true)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("Bid not valid");
    }

    counter++;
    newBid.id = counter;
    newBid.date = Math.round(Date.now() / 1000);
    new
    users.push(newUser);
    res
        .status(StatusCodes.CREATED)
        .send(newUser);
});


router.put("/:id", (req, res) => {
    let newUser = req.body;
    if (!checkUserValidity(newUser, true)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("User not valid");
    }

    let id = req.params.id;
    let user = users.find(user => user.id == id);
    if (user === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("User not found");
    }

    user = newUser;
    res
        .status(StatusCodes.OK)
        .send(user);
});


router.patch("/:id", (req, res) => {
    let newUser = req.body;
    if (!checkUserValidity(newUser)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("User not valid");
    }

    let id = req.params.id;
    let user = users.find(user => user.id == id);
    if (user === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("User not found");
    }

    for (const key of Object.keys(newUser)) {
        user[key] = newUser[key];
    }

    res
        .status(StatusCodes.OK)
        .send(user);
});


router.delete("/:id", (req, res) => {
    let id = req.params.id;

    let bidIndex = bids.findIndex(bid => bid.id == id);
    if (bidIndex === -1) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("User not found");
    }

    bids.splice(bidIndex, 1);

    res
        .status(StatusCodes.NO_CONTENT)
        .send();
});

//TODO: change this out for bids
function checkBidValidity(bid, allFields = false, excludeGenerated = false) {
    let checkFields = {};
    fields.forEach(field => {
        if (excludeGenerated && (
            field == "id" ||
            field == "secret"))
            return;

        checkFields[field] = false
    });

    for (const [key, val] of Object.entries(bid)) {

        checkFields[key] = true;

        if (key == "id" && (
            typeof val !== "number" ||
            val < 0)) {
            return false;
        }
        else if (key == "username" && (
            typeof val !== "string" ||
            val.length < 3 ||
            val.length > 200)) {
            return false;
        }
        else if (key == "email" && (
            typeof val !== "string" ||
            val.length < 3 ||
            val.length > 200 ||
            !val.includes("@"))) {
            return false;
        }
        else if (key == "password" && (
            typeof val !== "string" ||
            val.length == 0)) {
            return false;
        }
        else if (key == "secret" && (
            typeof val !== "string" ||
            val.length != 36)) {
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
