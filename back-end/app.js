require('dotenv').config();

const express = require('express');
const path = require('path'); // Add this to resolve paths correctly

const cors = require('cors');
const connectDB = require('./db');
const logger = require('./utils/logger');
const authRouter = require('./routes/auth');
const loansRouter = require('./routes/loans')
const transactionsRouter = require('./routes/transactions');
const morgan = require('morgan');


const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use('/auth', authRouter);
app.use('/user/:userId/loans', loansRouter);
app.use('/user/:userId/loans/:loanId/transactions', transactionsRouter);

app.get('/', (req, res) => {
    res.send('Hellasdfo World!');
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});