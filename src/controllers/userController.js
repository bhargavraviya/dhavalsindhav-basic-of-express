const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_TOKEN = process.env.SECRET_TOKEN;

const signup = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userModel.create({
      email: email,
      password: hashedPassword,
      username: username,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, SECRET_TOKEN);
   
    res.status(201).json({ success:true,message:'User Create Successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong " });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found " });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET_TOKEN
    );

    // existingUser = {...existingUser,password:null}
    res.status(200).json({success:true, user: existingUser,
      token: token  });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong " });
  }
};

module.exports = { signup, signin };
