const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    jobidslug: {
        type: String,
    },
    useremail: {
        type: String,
        required: true,
    },
    jobstatus: {
        type: String,
        required: true,
    },
    companyname: {
        type: String,
        required: true,
    },
    jobname: {
        type: String,
        required: true,
    },
    preparation: String,
    interviewquestion: [String],
    interviewexperience: String,
    salary: Number,
    order: Number,
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

const JobModel = mongoose.model("Job", jobSchema);

module.exports = JobModel;
