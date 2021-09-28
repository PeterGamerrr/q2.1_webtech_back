const fields = ["id", "name", "startPrice", "endDate", "region", "brand", "capacity"];
const fieldsToValidate = ["name", "startPrice", "endDate", "region", "brand", "capacity"];

let products = [
    {
        id: 0,
        name: "Heineken Oud Bruin",
        startPrice: 28,
        endDate: new Date(1977, 0).getTime(),
        region: "Amsterdam",
        brand: "Heineken",
        capacity: 33,
    },
    {
        id: 1,
        name: "Grolsch Stender Alcoholarm",
        startPrice: 42,
        endDate: new Date(1990, 0).getTime(),
        region: "Enschede",
        brand: "Grolsch",
        capacity: 33,
    },
];

let counter = products.length - 1;

module.exports = { fields, fieldsToValidate, products, counter };
