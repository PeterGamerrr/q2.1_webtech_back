const express = require('express');
const router = express.Router();
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

module.exports = router;
