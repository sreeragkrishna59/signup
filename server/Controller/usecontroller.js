const User = require('../Model/userSchema');
const cloudinary = require('../config/cloudinary');
const argon=require('argon2')
const jwt = require('jsonwebtoken');
require('dotenv').config()

// Helper function to stream memory buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'user_profiles' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(fileBuffer);
  });
};

const signup = async (req, res) => {
  try {
    console.log("client data in backend",req.body);
    
    let { name, email, mobile, age, address, password } = req.body;

password=await argon.hash(password)

console.log("where is password",password);
    // Check if image is provided
    if (!req.file) {
      return res.status(400).json({ message: 'Profile image is required' });
    }
    // Check for existing user by email or mobile
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or mobile number already in use' });
    }
    // Upload image buffer to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
console.log("cloudinary result ?",cloudinaryResult);

    // Create user (Argon2 hashes the password in schema pre-save hook)
    const newUser = new User({
      name,
      email,
      mobile,
      age,
      address,
      image: cloudinaryResult.secure_url, // Saves host link in database
      password,
    });

   const savedData= await newUser.save();
console.log("final answer",savedData);

    res.status(201).json({
      message: 'User registered successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    // 2. Search user in DB by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    // 3. Verify password
    const isValid = await argon.verify(user.password, password);

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    // 4. Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // 5. Send response
    return res.status(200).json({
      message: "Login successful",
      token,
      userId:user._id
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


async function getData(req,res){
  try{
let userData=await User.findById(req.params.id)
return res.status(200).json({SingleData:userData})
  }catch(err){
return res.status(500).json({error:err.message})
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("react datas 123",req.body); 
    console.log("react file",req.file);
    
    // 1. Database-il user unndo ennu nokkuka
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update cheyyan vendi maathrem ulla fields vecha dynamic object
    let updateFields = {};

    // Text fields input undengil maathram updateFields object-ilekk iduka
    const { name, email, mobile, age, address } = req.body;

    if (name) updateFields.name = name;
    if (age) updateFields.age = age;
    if (address) updateFields.address = address;

    // 2. Email / Mobile maarunnundengil maathram Duplicate check
    if ((email && email !== user.email) || (mobile && mobile !== user.mobile)) {
      const checkFilter = [];
      if (email && email !== user.email) checkFilter.push({ email });
      if (mobile && mobile !== user.mobile) checkFilter.push({ mobile });

      const existingUser = await User.findOne({ $or: checkFilter });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Email or mobile number already in use' 
        });
      }

      if (email) updateFields.email = email;
      if (mobile) updateFields.mobile = mobile;
    }



    // 4. Puthiya Image undengil maathram Cloudinary-il upload cheyyുക
    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      updateFields.image = cloudinaryResult.secure_url;
    }

    // 5. Update mathrem ullath maati save cheyyunnu ($set use cheythu)
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password'); // Password Response-il varadhirikaan

    res.status(200).json({
      message: 'Profile updated successfully',
      data: updatedUser,
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = { signup,login,getData,updateUser,deleteUser};