const {v4:uuidv4} = require('uuid');

let users = [
  {
    id: 1,
    username: 'gerralt',
    password: '$2a$10$N4Do4jE7/DGpGCPkP2avsekQxd1pYKLvqedIBce/trNpL4hB8MMK.', // gerralt123,
    secret: uuidv4()
  },
  {
    id: 2,
    username: 'guus',
    password: '$2a$10$608npxoLos.NngQkJUvU8e/7hgHTUNqGOLDgy/ZOh5CkWgL0ZuODq', // guus123,
    secret: uuidv4()
  },
];

module.exports = users;
