const expressAsyncHandler = require('express-async-handler');
const user = require("../models/userModel");
const generateToken = require('../middleware/generateToken');

//registeration code
const registerUser  = expressAsyncHandler(async (req , res) =>{
 const { username, email, password, isAdmin } = req?.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required fields' });
    }

    const userExists = await user.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const newUser = await user.create({ username, email, password, isAdmin });
    res.send("successfull");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});



// fetch all user
const fetchUsers = expressAsyncHandler(async(req , res)=>{
  try{
   const users = await user.find({});
   res.json(users);
  }
  catch(error){
    res.json(error);
  }
});

// for searching user credentials
const allUsers = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    :{};

  const users = await user.find(keyword).find({ _id:{$ne:req.user._id}} );
  res.send(users);
});



//login code
const loginuser = expressAsyncHandler(async(req , res)=>{
 const {email , password} = req?.body;
 const userfound = await user.findOne({email});
 if(userfound && (await userfound?.isPasswordMatch(password))){
   res.json({
    _id: userfound?._id,
    username: userfound?.username,
    email: userfound?.email,
    isAdmin: userfound?.isAdmin,
    token: generateToken(userfound?._id),
   })
 }
 else{
 res.status(401);
 throw new Error("Invalid Login credentials");
 }
});



module.exports = {registerUser , fetchUsers,loginuser, allUsers};