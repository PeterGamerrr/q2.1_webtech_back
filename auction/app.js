const express = require('express');
const path = require('path');
const logger = require('morgan');

const indexRouter   = require('./routes/index');
const usersRouter   = require('./routes/users');
const auctionRouter = require('./routes/auctions');
const bidsRouter = require('./routes/bids');
const productsRouter = require('./routes/products');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/'             , indexRouter);
app.use('/api/users'    , usersRouter);
app.use('/api/bids'     , auctionRouter);
app.use('/api/auctions' , bidsRouter);
app.use('/api/products' , productsRouter);

module.exports = app;
