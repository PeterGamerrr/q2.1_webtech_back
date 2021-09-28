const fields = ["id", "title", "endDate", "productId"];
const fieldsToValidate = ["title", "endDate", "productId"];

let auctions = [
    {
        id: 0,
        title: "Heineken Oud Bruin",
        endDate: Date.now() + 600000,
        productId: 0
    },
    {
        id: 1,
        title: "Grolsch Stender",
        endDate: Date.now() + 300000,
        productId: 1
    }
];

let counter = auctions.length - 1;

module.exports = { fields ,fieldsToValidate, auctions, counter };
