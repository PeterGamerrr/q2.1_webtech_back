const fields = ["id", "price", "hasWon", "date", "userId", "auctionId"];
const fieldsToValidate = ["price", "auctionId"];

let bids = [
    {
        id: 0,
        price: 30.2,
        hasWon: false,
        date: new Date(2021, 0).getTime(),
        userId: 0,
        auctionId: 0,
    },
    {
        id: 1,
        price: 25.6,
        hasWon: true,
        date: new Date(2006, 0).getTime(),
        userId: 1,
        auctionId: 1,
    },
];

let counter = bids.length - 1;

module.exports = {  fields, fieldsToValidate, bids, counter };
