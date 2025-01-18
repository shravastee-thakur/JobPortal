import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "interview"],
      default: "pending",
    },
    workType: {
      type: String,
      enum: ["Full Time", "Part Time", "Internship", "Contract"],
      default: "Full Time",
    },
    location: {
      type: String,
      default: "Mumbai",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
