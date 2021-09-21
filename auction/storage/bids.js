
let fields = [
    "id", "price", "hasWon", "userId", "auctionId", "date"
];

let bids = [
    {
        id: 0,
        price: 30.2,
        hasWon: false,
        userId: 0,
        auctionId: 0,
        date: 1632205182,
    },
    {
        id: 1,
        price: 25.6,
        hasWon: true,
        userId: 1,
        auctionId: 1,
        date: 1632205182,
    },
];

let counter = bids.length - 1;

module.exports = { bids, counter};
