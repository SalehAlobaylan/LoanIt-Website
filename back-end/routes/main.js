const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.send('Hellasdfo World!');
});

router.use('/auth', require('./auth')); // User-related routes

module.exports = router;
