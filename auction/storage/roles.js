const fields = ["id", "name"];

let roles = [
    {
        id: 0,
        name: "user",
    },
    {
        Id: 1,
        name: "admin",

    },
];

let counter = roles.length - 1;

module.exports = { fields, roles, counter };
