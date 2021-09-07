const express = require('express');
const router = express.Router();
const debug = require('debug')('auction:server');
const fs = require('fs');

let users;
fs.readFile('./storage/users.json', (err, data) => {
  if (err) throw err;
  users = JSON.parse(data);
})


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200)
  res.json(users);
});

//todo: write a saving script on shutdown

module.exports = router;
