const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const {v4:uuidv4} = require("uuid");
const bcrypt = require("bcrypt");
const isLoggedIn = require("../middleware/is-logged-in");
const { hasAdmin } = require("../middleware/has-role");
let { fields, fieldsToValidate, users, counter } = require("../storage/users");


router.get("/", isLoggedIn, hasAdmin, (req, res) => {
    let usersToSend = null;

    if (Object.keys(req.query).length === 0) {
        usersToSend = users;
    } else {
        usersToSend = users.filter(user => {
            for (const [key, val] of Object.entries(req.query)) {
                if (user[key] && user[key].toLowerCase() !== val.toLowerCase()) {
                    return false;
                }
            }

            return true;
        })
    }

    res
        .status(StatusCodes.OK)
        .send(usersToSend);
});


router.get("/:id", (req, res) => {
    let id = req.params.id;
    let user = users.find(user => user.id == id);
    if (user === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("User not found");
    }

    res
        .status(StatusCodes.OK)
        .send(user);
});


router.post("/", (req, res) => {
    let newUser = req.body;

    if (!validatePassword(newUser.password)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("User password not secure");
    }

    if (!checkUserValidity(newUser, true)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("User not valid");
    }

    counter++;

    newUser.id = counter;
    newUser.secret = uuidv4();

    bcrypt.hash(newUser.password, 10, function(err, hash) {
        newUser.password = hash;
        users.push(newUser);
    });

    res
        .status(StatusCodes.CREATED)
        .send(newUser);
});


router.put("/:id", isLoggedIn, (req, res) => {
    let id = req.params.id;
    if (req.user.id !== id && !req.user.roles.includes("Admin")) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .send("Not authorized");
    }

    let newUser = req.body;
    if (!checkUserValidity(newUser, true)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("User not valid");
    }

    let user = users.find(user => user.id == id);
    if (user === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("User not found");
    }

    fieldsToValidate.forEach(field => {
        if (newUser[field]) {
            user[field] = newUser[field];
        }
    });

    res
        .status(StatusCodes.OK)
        .send(user);
});


router.patch("/:id", isLoggedIn, (req, res) => {
    let id = req.params.id;
    if (req.user.id !== id && !req.user.roles.includes("Admin")) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .send("Not authorized");
    }

    let newUser = req.body;
    if (!checkUserValidity(newUser)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("User not valid");
    }

    let user = users.find(user => user.id === id);
    if (user === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("User not found");
    }

    fieldsToValidate.forEach(field => {
        if (newUser[field]) {
            user[field] = newUser[field];
        }
    });

    res
        .status(StatusCodes.OK)
        .send(user);
});


router.delete("/:id", isLoggedIn, (req, res) => {
    let id = req.params.id;
    if (req.user.id !== id && !req.user.roles.includes("Admin")) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .send("Not authorized");
    }

    let userIndex = users.findIndex(user => user.id == id);
    if (userIndex == -1) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send("User not found");
    }

    users.splice(userIndex, 1);

    res
        .status(StatusCodes.NO_CONTENT)
        .send();
});


function validatePassword(password) {
    if (typeof password == "string" &&
        password.length >= 4 &&
        password.length <= 20) {
        return true;
    }

    return false;
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
        }
        else if (key == "email" && (
            typeof val !== "string" ||
            val.length < 3 ||
            val.length > 200 ||
            !val.includes("@"))) {
            return false;
        }
        else if (key == "roles" && (
            typeof val !== "array" ||
            val.length == 0 ||
            val.includes("admin"))) {
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
