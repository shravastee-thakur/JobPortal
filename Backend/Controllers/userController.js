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

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      success: true,
      user: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
      },
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
    const { email, password } = req.body;
    if (!(email && password)) {
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
        userExists: {
          name: userExists.name,
          lastName: userExists.lastName,
          email: userExists.email,
          location: userExists.location,
        },
        message: `Welcome back ${userExists.name}`,
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
    const { name, lastName, email, location } = req.body;
    if (!(name || lastName || email || location)) {
      return res.status(400).json({
        success: false,
        message: "All fields is required",
      });
    }

    // check if user exist

    const userId = req.user.userId;
    console.log(userId);

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
      { name, lastName, email, location },
      { new: true }
    );
    updatedUser.save();

    return res.status(200).json({
      success: true,
      updatedUser: {
        name: updatedUser.name,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        location: updatedUser.location,
      },
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
