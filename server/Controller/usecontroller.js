const User = require('../Model/userSchema');
const cloudinary = require('../config/cloudinary');
const argon=require('argon2')
const jwt = require('jsonwebtoken');
require('dotenv').config()
const otpSch=require('../Model/OtpSchema')
const nodemailer = require('nodemailer');

// Helper function to stream memory buffer to Cloudinary
// const uploadToCloudinary = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder: 'user_profiles' },
//       (error, result) => {
//         if (result) resolve(result);
//         else reject(error);
//       }
//     );
//     stream.end(fileBuffer);
//   });
// };

//node mailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // അല്ലങ്കിൽ host: 'smtp.gmail.com', port: 465, secure: true
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log('Transporter Error:', error);
  } else {
    console.log('Server is ready to send emails!');
  }
});
//

const signup = async (req, res) => {
  try {
    console.log("client data in backend",req.body);
    
    let { name, email, mobile, age, address, password } = req.body;

password=await argon.hash(password)

console.log("where is password",password);
    // Check if image is provided
    if (!req.file) {
      console.log("check one");
      
      return res.status(400).json({ message: 'Profile image is required' });
    }
    console.log("check two");
    // Check for existing user by email or mobile
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      console.log("check three");
      return res.status(400).json({ message: 'Email or mobile number already in use' });
    }
    console.log("check four",req.file);
    // Upload image buffer to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
console.log("cloudinary result ?",cloudinaryResult);
console.log("check fife");
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
console.log("check six");
   const savedData= await newUser.save();
console.log("final answer",savedData);
console.log("check seven");
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
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path)
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

const generateEmail=async(req,res)=>{
  const { email } = req.body;
let otp=Math.floor(100000 + Math.random() * 900000);
console.log("email data ..........................................",email);

  // Basic Validation
  if (!email) {
    return res.status(400).json({ message: 'Email are required' });
  }

  // Email Options
  const mailOptions = {
    from: `"SG-59"<${process.env.EMAIL_USER}>`,
    to: email,
    subject: "DIGINET OTP",
    text:'OTP is shown below',
    html:`<h2><strong>${otp}</strong></h2>`, // Custom HTML കൊടുക്കാം (e.g. OTP, Reset link)
  };

  try {
        await otpSch.create({email,otp})
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
}

const verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
console.log("otp vanno?",email,otp);

    // 1. Basic Validation
    if (!otp || !email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and OTP are required" 
      });
    }

    // 2. Find OTP in DB
    const findOTP = await otpSch.findOne({ email });
console.log("where is findOtp",findOTP);

    // OTP ഇല്ലാത്ത അവസ്ഥ (എക്സ്പയർ ആവുകയോ അയക്കാതിരിക്കുകയോ ചെയ്തിരിക്കാം)
    if (!findOTP) {
      return res.status(400).json({ 
        success: false, 
        message: "OTP has expired or was not sent" 
      });
    }

    // 3. Verify OTP (String ലേക്ക് കൺവേർട്ട് ചെയ്ത് മാച്ച് ചെയ്യുന്നു)
    if (String(findOTP.otp) !== String(otp)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid OTP. Please try again" 
      });
    }

    // 4. OTP മാച്ച് ആയാൽ ഡാറ്റാബേസിൽ നിന്ന് ഡിലീറ്റ് ചെയ്യുന്നു (To prevent reuse)
    await otpSch.deleteOne({ _id: findOTP._id });

    // 5. Success Response
    return res.status(200).json({ 
      success: true, 
      message: "OTP verified successfully" 
    });

  } catch (err) {
    console.error("Error in verifyOtp:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: err.message 
    });
  }
};

const resetPass = async (req, res) => {
  console.log(".......................*********************++++++++++++++++++++",req.body);
  const { password, email } = req.body;
console.log(".......................*********************++++++++++++++++++++",req.body);

  if (!email || !password) {
    return res.status(400).json({ status: false, message: 'Email and password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ status: false, message: 'Password must be at least 8 characters' });
  }

  
  try {
    const hashedPassword = await argon.hash(password);
console.log("hashed pass",hashedPassword);

    const updatedUsers = await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );
console.log("updateuser",updatedUsers);

    if (!updatedUsers) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    return res.status(200).json({ status: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('resetPass error:', err);
    return res.status(500).json({ status: false, message: 'Something went wrong' });
  }
};

module.exports = { signup,login,getData,updateUser,deleteUser,generateEmail,verifyOtp,resetPass};