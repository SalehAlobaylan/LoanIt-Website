const express = require('express');
const { register, login } = require('../controllers/auth');
const { validateRequest } = require('../middlewares/validation');
const { registerSchema, loginSchema } = require('../validators/authSchemas');

const router = express.Router();

router.post('/login', validateRequest(loginSchema), login);
router.post('/register', validateRequest(registerSchema), register);


module.exports = router;