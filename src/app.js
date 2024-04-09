const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv');
const bookRouter = require('./routes/book.routes');
const bodyParser = require('body-parser');

env.config();

//Express para los middleware
const app = express();
app.use(bodyParser.json()); //Parseador de bodies

//Conectamos la BD
mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME});
const db = mongoose.connection;
app.use('/books', bookRouter);


const port = process.env.PORT ||3000;

app.listen(port, ()=>{
    console.log(`Iniciado en el puerto ${port}`);
})