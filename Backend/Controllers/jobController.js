import mongoose from "mongoose";
import Job from "../Models/jobModel.js";

export const createJob = async (req, res) => {
  try {
    // get user data
    const { company, position } = req.body;
    if (!(company || position)) {
      return res.status(400).json({
        success: false,
        message: "All fields is required",
      });
    }
    // create job
    req.body.createdBy = req.user.userId;
    const newJob = new Job({ ...req.body, createdBy: req.user.userId });
    await newJob.save();
    return res.status(200).json({
      success: true,
      data: newJob,
      message: "Job created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error creating job",
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const allJobs = await Job.find({ createdBy: req.user.userId });
    return res.status(200).json({
      success: true,
      data: allJobs,
      totalJobs: allJobs.length,
      message: "Jobs fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error getting jobs",
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!req.user.userId === req.body.createdBy)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized to update" });
    ``;

    const updateJob = await Job.findByIdAndUpdate(
      jobId,
      { ...req.body },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: updateJob,
      message: "Job updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error updating job",
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!req.user.userId === req.body.createdBy)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized to delete" });

    await Job.findByIdAndDelete(jobId, { ...req.body }, { new: true });

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error deleting job",
    });
  }
};

export const jobStats = async (req, res) => {
  const stats = await Job.aggregate([
    // search jobs by user id

    {
      $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) },
    },
    {
      $group: { _id: "$status", count: { $sum: 1 } },
    },
  ]);

  return res.status(200).json({
    success: true,
    totalJobs: stats.length,
    data: stats,
    message: "Job stats fetched successfully",
  });
};
