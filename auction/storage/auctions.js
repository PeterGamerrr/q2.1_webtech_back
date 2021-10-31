const fields = ["id", "startPrice", "price", "startDate", "endDate", "productId"];
const fieldsToQuery = ["startPrice", "price", "startDate", "endDate", "productId"];
const fieldsToValidate = ["endDate", "productId"];

let auctions = [
    {
        id: 0,
        startPrice: 25,
        price: 30.2,
        startDate: new Date(2020, 0).getTime(),
        endDate: new Date(2022, 0).getTime(),
        productId: 0
    },
    {
        id: 1,
        startPrice: 23,
        price: 25.6,
        startDate: new Date(2005, 0).getTime(),
        endDate: new Date(2007, 0).getTime(),
        productId: 1
    },
    {
        id: 2,
        startPrice: 23,
        price: 25.6,
        startDate: new Date(2005, 0).getTime(),
        endDate: new Date(2007, 0).getTime(),
        productId: 1
    },
    {
        id: 3,
        startPrice: 23,
        price: 25.6,
        startDate: new Date(2005, 0).getTime(),
        endDate: new Date(2007, 0).getTime(),
        productId: 1
    },
    {
        id: 4,
        startPrice: 23,
        price: 25.6,
        startDate: new Date(2005, 0).getTime(),
        endDate: new Date(2007, 0).getTime(),
        productId: 1
    },
    {
        id: 5,
        startPrice: 23,
        price: 25.6,
        startDate: new Date(2005, 0).getTime(),
        endDate: new Date(2007, 0).getTime(),
        productId: 1
    },
    {
        id: 6,
        startPrice: 23,
        price: 25.6,
        startDate: new Date(2005, 0).getTime(),
        endDate: new Date(2007, 0).getTime(),
        productId: 1
    }
];

let counter = auctions.length - 1;

module.exports = { fields, fieldsToQuery, fieldsToValidate, auctions, counter };
