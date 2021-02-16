const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  activity: [
    {
      description: { type: String, required: true, default: "" },
      olditem: { type: String, required: true, default: "" },
      companyname: { type: String, required: true, default: "" },
      jobname: { type: String, required: true, default: "" },
      status: { type: String, required: true, default: "" },
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
