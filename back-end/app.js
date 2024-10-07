require('dotenv').config();

const express = require('express');

const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// app.use(express.json());

app.use('/', require('./routes/main'));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});