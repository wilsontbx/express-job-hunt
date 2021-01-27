const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  jobstatus: {
    type: String,
    required: true,
  },
  joblist: [
    {
      _id: { type: String, required: true },
      companyname: { type: String, required: true },
      jobname: { type: String, required: true },
      preparation: String,
      interviewquestion: String,
      interviewexperience: String,
      salary: Number,
    },
  ],
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const StatusModel = mongoose.model("Status", statusSchema);

module.exports = StatusModel;
