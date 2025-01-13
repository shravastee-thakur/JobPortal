import express from "express";
import {
  getAllCompanies,
  registerCompany,
} from "../Controllers/companyController.js";
const router = express.Router();

// register company
router.post("/register-company", registerCompany);
// get all companies
router.get("/get-all-companies", getAllCompanies);

export default router;
