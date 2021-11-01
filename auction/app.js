const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");

require('dotenv').config();

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/",                require("./routes/index"));
app.use("/api/credentials", require('./routes/credentials'));
app.use("/api/users",       require("./routes/users"));
app.use("/api/bids",        require("./routes/bids"));
app.use("/api/auctions",    require("./routes/auctions"));
app.use("/api/products",    require("./routes/products"));

module.exports = app;
