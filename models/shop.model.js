const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Falta o nome!']},
        discount: { type: Number, required: [true, 'Falta o desconto!']}, //ver se fica Number ou String
        amountPoints: { type: Number, required: [true, 'Falta a quantide de pontos necessários!']},
        info: { type: String, required: [true, 'Falta uma descrição']},
        traded: {type: Boolean, default: false}
    }
);
const Shop = mongoose.model("shop", schema);

module.exports = Shop;