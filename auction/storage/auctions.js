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

const fieldsToValidate = ["title", "productId", "endDate"];

const fields = ["id", "title","productId", "endDate"];


let counter = auctions.length - 1;

module.exports = { auctions, counter,fields ,fieldsToValidate};
