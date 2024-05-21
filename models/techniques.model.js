const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Falta o nome!']
    },
});
const Technique = mongoose.model("techniques", schema);

module.exports = Technique;