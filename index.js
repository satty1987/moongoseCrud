const express = require('express')
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const http = require('http').Server(app);
var logger = require("morgan");
const dotenv = require('dotenv');
dotenv.config();


//Custom Routes
const router = require("./routes/route.js")



const port = process.env.NODE_ENV || 3000
const mongoDB = process.env.DB_MONGO_URL;
const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}



// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger(process.env.DB_ENV));
app.use(express.json());
app.use(express.static("public"));

app.use('/api', router);
app.use((req, res) => {
    res.status(404).send({ message: 'Route' + req.url + ' Not found.' });
})

// Routes


mongoose.connect(mongoDB, option);
let db = mongoose.connection;
mongoose.Promise = global.Promise;
db.once('open', function () {
    http.listen(port, () => {
        console.log("Listening on port " + port)
        app.emit('APP_STARTED')
    })
});

db.on('error', function () {
    console.log(err);
});
// app.listen(port, () => console.log(`Example app listening on port port!`))
