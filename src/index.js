const express = require('express');
const router = require('./routes/routes');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

app.use(router);

app.listen(8080, async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/sales');
    console.log(`Server listening port: 8080`);
});