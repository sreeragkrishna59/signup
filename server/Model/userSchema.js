const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    address: { type: String, required: true, trim: true },
    image: { type: String, required: true }, // Stores Cloudinary secure URL
    password: { type: String, required: true },
  },
  { timestamps: true }
);


module.exports = mongoose.model('User', userSchema);