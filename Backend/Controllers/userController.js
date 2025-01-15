import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const Register = async (req, res) => {
  try {
    // get user data
    const { name, email, password } = req.body;

    // validation
    if (!(name && email && password)) {
      return res.status(400).json({
        success: false,
        message: "All fields is required",
      });
    }

    // check if user already exist
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    return res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error creating user",
    });
  }
};

export const Login = async (req, res) => {
  try {
    // get user data
    const { email, password, role } = req.body;
    if (!(email && password && role)) {
      return res.status(400).json({
        success: false,
        message: "All fields is required",
      });
    }
    // check if user exist
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }
    // check if password is correct
    const validPassword = await bcrypt.compare(password, userExists.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    // role check
    if (role !== userExists.role) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // create token
    const tokenData = { userId: userExists._id };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true, // client can't get cookie by script
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "Strict",
        secure: true, // only transfer over https
      })
      .json({
        success: true,
        data: userExists,
        message: `Welcome back ${userExists.fullname}`,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error logging in",
    });
  }
};

export const Logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        sameSite: "none",
        secure: true,
      })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error logging out",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // get user data
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    // const file = req.file;

    // check if user exist
    const skillsArray = skills ? skills.split(",") : [];

    const userId = req.user.id;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    // cloudinary upload

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullname, email, phoneNumber, bio, skills: skillsArray },
      { new: true }
    );
    updatedUser.save();

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
};
