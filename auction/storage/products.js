const fields = ["id", "name", "brand", "region", "capacity"];
const fieldsToValidate = ["name", "brand", "region", "capacity"];

let products = [
    {
        id: 0,
        name: "Heineken Oud Bruin",
        brand: "Heineken",
        region: "Amsterdam",
        capacity: 330,
    },
    {
        id: 1,
        name: "Grolsch Stender Alcoholarm",
        brand: "Grolsch",
        region: "Enschede",
        capacity: 330,
    },
];

let counter = products.length - 1;

module.exports = { fields, fieldsToValidate, products, counter };
