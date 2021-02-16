const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  activity: [
    {
      description: { type: String },
      olditem: { type: String },
      olditemjob: { type: String },
      companyname: { type: String },
      jobname: { type: String },
      status: { type: String },
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

const NotificationModel = mongoose.model("notification", notificationSchema);

module.exports = NotificationModel;
