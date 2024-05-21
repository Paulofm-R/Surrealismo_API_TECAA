const mongoose  = require('mongoose')

const schema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Falta o nome!']},
        email: { type: String, required: [true, 'Falta o seu email'], unique: true},
        password: { type: String, required: [true, 'Falta uma palavra-passe!']},
        image: { type: String, default: ''},
        birthDate: {type: Date, required: [true, 'Falta a sua data de nascimento!']},
        locality: { type: String, required: [true, 'Falta a sua localidade']},
        type: {type: String, enum: {values: ['user', 'admin'], message: '{VALUE} não é suportado'}, default: 'user'},
        active: { type: Boolean, default: true},
        points: {type: Number, default: 0},
        gamesPlayed: {type: Array, default: []},
        exchanges: {type: Array, default: []},
        favoritesArt: {type: Array, default: []},
        favoritesArtist: {type: Array, default: []},
        favoritesNew: {type: Array, default: []},
    }
);
const User = mongoose.model("Users", schema);

module.exports = User;