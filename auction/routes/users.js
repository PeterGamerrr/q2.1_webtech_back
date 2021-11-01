const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const {v4:uuidv4} = require("uuid");
const bcrypt = require("bcrypt");
const isLoggedIn = require("../middleware/is-logged-in");
const { isSelfOrAdmin, hasAdmin } = require("../middleware/has-role");
const re = /^\S+@\S+\.(com|nl)$/; //matches all email formats ending in .com and .nl
let { fields, fieldsToValidate, users, counter } = require("../storage/users");


router.get("/", isLoggedIn, hasAdmin, (req, res) => {
    let usersToSend = null;

    if (Object.keys(req.query).length === 0) {
        usersToSend = sanitizeUserArray(users);
    } else {
        usersToSend = sanitizeUserArray(users).filter(user => {
            for (const [key, val] of Object.entries(req.query)) {
                if (user[key] !== undefined && user[key].toString().toLowerCase() !== val.toLowerCase()) {
                    return false;
                }
            }

            return true;
        })
    }

    res
        .status(StatusCodes.OK)
        .json(usersToSend);
});


router.get("/:id", (req, res) => {
    let id = req.params.id;
    let user = users.find(user => user.id == id);
    if (user === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"User not found"});
    }

    res
        .status(StatusCodes.OK)
        .json(sanitizeUser(user));
});


router.post("/", (req, res) => {
    let newUser = req.body;
    if (newUser === undefined || Object.keys(newUser).length === 0) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"User empty"});
    }

    if (!validatePassword(newUser.password)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"User password not secure"});
    }

    if (!checkUserValidity(newUser, true)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"User not valid"});
    }

    counter++;
    newUser.id = counter;
    newUser.secret = uuidv4();
    newUser.roles = ["user"]

    bcrypt.hash(newUser.password, 10, function(err, hash) {
        newUser.password = hash;
        users.push(newUser);
    });

    res
        .status(StatusCodes.CREATED)
        .json(sanitizeUser(newUser));
});


router.put("/:id", isLoggedIn, isSelfOrAdmin, (req, res) => {
    let id = req.params.id;

    let newUser = req.body;
    if (!checkUserValidity(newUser, true)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"User not valid"});
    }

    let user = users.find(user => user.id == id);
    if (user === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"User not found"});
    }

    fieldsToValidate.forEach(field => {
        if (newUser[field] !== undefined) {
            user[field] = newUser[field];
        }
    });

    res
        .status(StatusCodes.OK)
        .json(sanitizeUser(user));
});


router.patch("/:id", isLoggedIn, isSelfOrAdmin, (req, res) => {
    let id = req.params.id;

    let newUser = req.body;
    if (!checkUserValidity(newUser)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"User not valid"});
    }

    let user = users.find(user => user.id == id);
    if (user === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"User not found"});
    }

    fieldsToValidate.forEach(field => {
        if (newUser[field] !== undefined) {
            user[field] = newUser[field];
        }
    });

    res
        .status(StatusCodes.OK)
        .json(sanitizeUser(user));
});


router.delete("/:id", isLoggedIn, isSelfOrAdmin, (req, res) => {
    let id = req.params.id;

    let userIndex = users.findIndex(user => user.id == id);
    if (userIndex == -1) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"User not found"});
    }
    let user = users[userIndex];

    users.splice(userIndex, 1);

    res
        .status(StatusCodes.OK)
        .json(sanitizeUser(user));
});

router.delete("/", isLoggedIn, hasAdmin, (req, res) => {
    if (process.env.NODE_ENV !== "dev") {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"This request can't be used in production."});
    }

    res
        .status(StatusCodes.OK)
        .json(users);

    users = [];
    counter = -1;
});


function validatePassword(password) {
    if (typeof password != "string" &&
        password.length < 6 &&
        password.length > 64) {
        return false;
    }

    let hasCapital = false;
    let hasNumber = false;

    [...password].forEach(letter => {
        if(letter === letter.toUpperCase()) hasCapital = true;
        if(!isNaN(letter)) hasNumber = true;
    })

    return hasCapital && hasNumber;
}

function sanitizeUser(user) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles
    }
}

function sanitizeUserArray(users) {
    return users.map(sanitizeUser)
}

function checkUserValidity(user, allFields = false) {
    let checkFields = {};
    fieldsToValidate.forEach(field => {
        checkFields[field] = false
    });

    for (const [key, val] of Object.entries(user)) {
        checkFields[key] = true;

        if (key == "username" && (
            typeof val !== "string" ||
            val.length < 3 ||
            val.length > 200)) {
            return false;
        } else if (key == "email" && (
            typeof val !== "string" ||
            val.length < 3 ||
            val.length > 200 ||
            !re.test(val))) {
            return false;
        } else if (key == "roles" && (
            val.length == 0 ||
            val.includes("admin"))) {
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
