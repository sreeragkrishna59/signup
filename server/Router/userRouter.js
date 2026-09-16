const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { signup, login, getData, updateUser, deleteUser } = require('../Controller/usecontroller');
const { verifyToken } = require('../middleware/verifyToken');


// Route handling multipart form-data for signup
router.post('/signup', upload.single('image'), signup);
router.post('/login', login);
router.get('/getData/:id',verifyToken,getData);
// Accepts optional image upload via Multer
router.put('/updateUser/:id', upload.single('image'),verifyToken,updateUser);
router.delete('/deleteData/:id',verifyToken,deleteUser)
module.exports = router;