require('dotenv').config();

const express = require('express');
const path = require('path'); // Add this to resolve paths correctly

const cors = require('cors');
const connectDB = require('./db');
const logger = require('./utils/logger');
const authRouter = require('./routes/auth');
const loansRouter = require('./routes/loans')

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use(logger);

app.use(express.static(path.join(__dirname, 'home-page')));
app.use('/auth', authRouter);
app.use('/user/:userId/loans', loansRouter);

app.get('/', (req, res) => {
    res.send('Hellasdfo World!');
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});