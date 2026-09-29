const express = require('express');
const router = express.Router();
// const upload = require('../middleware/upload');
const { signup, login, getData, updateUser, deleteUser, generateEmail, verifyOtp, resetPass } = require('../Controller/usecontroller');
const { verifyToken } = require('../middleware/verifyToken');
const multer=require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Images')
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname)
  }
})


const upload = multer({ storage: storage })
// Route handling multipart form-data for signup
router.post('/signup', upload.single('image'), signup);
router.post('/login', login);
router.get('/getData/:id',verifyToken,getData);
// Accepts optional image upload via Multer
router.put('/updateUser/:id', upload.single('image'),verifyToken,updateUser);
router.delete('/deleteData/:id',verifyToken,deleteUser)

router.post('/verifyOTP',generateEmail)
router.post('/verifyOTPstep1',verifyOtp)

router.post('/resetPassword',resetPass)
module.exports = router;