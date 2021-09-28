const {v4:uuidv4} = require("uuid");

const fields = ["id", "username", "email", "password", "secret", "roleIds"];
const fieldsToSend = ["id", "username", "email", "roleIds"];
const fieldsToQuery = ["username", "email", "roleIds"];
const fieldsToValidate = ["username", "email"];

let users = [
    {
        id: 0,
        username: "gerralt",
        email: "gerralt@email.com",
        password: "$2a$10$N4Do4jE7/DGpGCPkP2avsekQxd1pYKLvqedIBce/trNpL4hB8MMK.", // gerralt123
        secret: "GERRALT", //uuidv4()
        roleIds: [0, 1]
    },
    {
        id: 1,
        username: "guus",
        email: "guus@email.com",
        password: "$2a$10$608npxoLos.NngQkJUvU8e/7hgHTUNqGOLDgy/ZOh5CkWgL0ZuODq", // guus123
        secret: "GUUS", //uuidv4()
        roleIds: [0]
    },
];

let counter = users.length - 1;

module.exports = { fields, fieldsToSend, fieldsToQuery, fieldsToValidate, users, counter };
