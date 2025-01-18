import express from "express";
import { authenticateToken } from "../Middleware/Auth.js";
import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
} from "../Controllers/jobController.js";

const router = express.Router();

// create job
router.post("/create-job", authenticateToken, createJob);

// get all jobs
router.get("/get-all-jobs", authenticateToken, getAllJobs);

// update job
router.put("/update-job/:id", authenticateToken, updateJob);

// delete job
router.delete("/delete-job/:id", authenticateToken, deleteJob);

export default router;
