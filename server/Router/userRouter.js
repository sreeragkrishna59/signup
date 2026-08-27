const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { signup, login, getData } = require('../Controller/usecontroller');
const { verifyToken } = require('../middleware/verifyToken');


// Route handling multipart form-data for signup
router.post('/signup', upload.single('image'), signup);
router.post('/login', login);
router.get('/getData/:id',verifyToken,getData);
module.exports = router;