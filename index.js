require('dotenv').config(); // read environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT;

const expressSwagger = require('express-swagger-generator')(app);
const options = require('./swagger_conf.js');
expressSwagger(options);

app.use(express.json()); //enable parsing JSON body data
// root route -- /api/
app.get('/', function (req, res) {
    res.status(200).json({
        message: 'Welcome Surrealismo-API'
    });
});

// routing middleware
app.use('/users', require('./routes/users.routes.js'))
app.use('/games', require('./routes/games.routes.js'))
app.use('/arts', require('./routes/arts.routes.js'))
app.use('/news', require('./routes/news.routes.js'))
app.use('/artists', require('./routes/artists.routes.js'))
app.use('/shop', require('./routes/shop.routes.js'))
app.use('/techniques', require('./routes/techniques.routes.js'))


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.on3a1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', () => {
    console.log("connected to MongoDB");
})

// handle invalid routes
app.get('*', function (req, res) {
    res.status(404).json({
        message: 'WHAT???'
    });
})
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));