const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Falta o nome']},
        image: { type: String, required: [true, 'Falta a imagem']},
        info: { type: String, required: [true, 'Falta uma descrição']},
        born:{type: String, required: [true, 'Falta a data de nascimento']},
        death:{type: String},
        arts: {type: Array}
    }
);
const Artist = mongoose.model("artists", schema);

module.exports = Artist;