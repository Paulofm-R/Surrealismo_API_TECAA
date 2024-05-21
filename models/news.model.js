const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Falta o nome!']},
        image: { type: String, required: [true, 'Falta a imagem!']},
        day: { type: Date, required: [true, 'Falta o dia!']},
        price: {type: Number},
        info: { type: String, required: [true, 'Falta uma descrição']},
        locality: { type: String},
        type: {type: String, enum: {values: ['Noticia', 'Evento'], message: '{VALUE} não é suportado'}, default: 'Noticia'}
    }
);
const News = mongoose.model("news", schema);

module.exports = News;