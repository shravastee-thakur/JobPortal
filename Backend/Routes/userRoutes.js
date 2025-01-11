import express from "express";
import {
  Login,
  Logout,
  Register,
  updateProfile,
} from "../Controllers/userController.js";

const router = express.Router();

// register
router.post("/register", Register);

// login
router.post("/login", Login);

// logout
router.post("/logout", Logout);

// update profile
router.put("/update-profile/:id", updateProfile);

export default router;
