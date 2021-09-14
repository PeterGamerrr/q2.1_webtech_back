const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
let { users, counter } = require("../storage/users");

router.get("/", (req, res) => {
    res
        .status(StatusCodes.OK)
        .send(users);
});

router.post("/", (req, res) => {
    let newUser = req.body;
    users.push(newUser);
    res
        .status(StatusCodes.CREATED)
        .send(newUser);
});

router.put("/:id", (req, res) => {
    let id = req.params.id;
    let user = users.find(user => user.id === id);
    user = req.body;
    res
        .status(StatusCodes.CREATED)
        .send(user);
});

router.patch("/:id", (req, res) => {
    let id = req.params.id;
    let newUser = req.body;
    let user = users.find(user => user.id === id);
    newUser.forEach(e => {
        if (newUser[e] != user[e]) {
            user[e] = newUser[e];
        }
    });
    res
        .status(StatusCodes.CREATED)
        .send(newUser);
});

router.delete("/:id", (req, res) => {
    let id = req.params.id;
    users.splice(users.findIndex(user => user.id === id), 1);

    res
        .status(StatusCodes.OK)
        .send();
});

module.exports = router;
