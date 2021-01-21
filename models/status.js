const mongoose = require("mongoose");
// this schema is just for supporting the job
const statusSchema = new mongoose.Schema({
    useremail: {
        type: String,
        required: true,
    },
    jobstatus: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
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

const StatusModel = mongoose.model("Job", statusSchema);

module.exports = StatusModel;
