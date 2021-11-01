const fields = ["id", "name", "brand", "region", "capacity"];
const fieldsToValidate = ["name", "brand", "region", "capacity"];

let products = [
    {
        id: 0,
        name: "Heineken Oud Bruin",
        brand: "Heineken",
        region: "Amsterdam",
        capacity: 250,
    },
    {
        id: 1,
        name: "Grolsch Stender Alcoholarm",
        brand: "Grolsch",
        region: "Enschede",
        capacity: 250,
    },
    {
        id: 2,
        name: "hertog-jan blikje",
        brand: "Hertog-Jan",
        region: "Noord-brabant",
        capacity: 330,
    },
    {
        id: 3,
        name: "grolsch beugel",
        brand: "Grolsch",
        region: "Enschede",
        capacity: 450
    }
];

let counter = products.length - 1;

module.exports = { fields, fieldsToValidate, products, counter };
