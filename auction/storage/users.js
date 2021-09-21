const {v4:uuidv4} = require("uuid");

const fields = ["id", "username", "email", "roles", "password", "secret"];
const pubFields = ["username", "email", "roles"];

let users = [
    {
        id: 0,
        username: "gerralt",
        email: "gerralt@email.com",
        roles: ["User", "Admin"],
        password: "$2a$10$N4Do4jE7/DGpGCPkP2avsekQxd1pYKLvqedIBce/trNpL4hB8MMK.", // gerralt123,
        secret: uuidv4()
    },
    {
        id: 1,
        username: "guus",
        email: "guus@email.com",
        roles: ["User"],
        password: "$2a$10$608npxoLos.NngQkJUvU8e/7hgHTUNqGOLDgy/ZOh5CkWgL0ZuODq", // guus123,
        secret: uuidv4()
    },
];

let counter = users.length - 1;

module.exports = { fields, pubFields, users, counter};
