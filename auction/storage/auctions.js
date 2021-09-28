const fields = ["id", "startPrice", "price", "startDate", "endDate", "productId"];
const fieldsToValidate = ["endDate", "productId"];

let auctions = [
    {
        id: 0,
        startPrice: 25,
        price: 30.2,
        startDate: new Date(2000, 0).getTime(),
        endDate: new Date(2000, 0).getTime(),
        productId: 0
    },
    {
        id: 1,
        startPrice: 23,
        price: 25.6,
        startDate: new Date(2000, 0).getTime(),
        endDate: new Date(2000, 0).getTime(),
        productId: 1
    }
];

let counter = auctions.length - 1;

module.exports = { fields ,fieldsToValidate, auctions, counter };
