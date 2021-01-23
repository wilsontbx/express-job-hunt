const JobModel = require("../models/job");
const StatusModel = require("../models/Status");
const _ = require("lodash");

const jobControllers = {
  render: (req, res) => {
    StatusModel.find({
      useremail: req.body.useremail,
    })
      .sort({ order: 1 }) //
      .then((statusResult) => {
        if (!statusResult) {
          res.statueCode = 401;
          res.json({
            success: false,
            message: "The is job status column is empty",
          });
          return;
        }
        JobModel.find({ useremail: req.body.useremail })
          .sort({ order: 1 })
          .then((jobResult) => {
            if (!jobResult) {
              res.statueCode = 401;
              res.json({
                success: false,
                message: "There no job for this user",
              });
              return;
            }
            let allResult = statusResult.map((val) => ({
              status: val,
              joblist: jobResult.filter(
                (job) => job.jobstatus === val.jobstatus
              ),
            }));
            res.statusCode = 200;
            res.json({
              success: true,
              message: "Job and Status found",
              // status: statusResult,
              // job: jobResult,
              allResult: allResult,
            });
          })
          .catch((err) => {
            res.statusCode = 401;
            res.json({
              success: false,
              message: "user unauthorized (job)",
            });
          });
      })
      .catch((err) => {
        res.statusCode = 401;
        res.json({
          success: false,
          message: "user unauthorized (status)",
        });
      });
  },
  createStatus: (req, res) => {
    StatusModel.create({
      useremail: req.body.useremail,
      jobstatus: req.body.jobstatus,
      order: req.body.order,
    })
      .then((result) => {
        res.statueCode = 201;
        res.json({
          success: true,
          result: result,
          message: "success create new status",
        });
      })
      .catch((err) => {
        res.statueCode = 409;
        res.json({
          success: false,
          message: "fail to create new status",
        });
      });
  },
  createJob: (req, res) => {
    JobModel.create({
      useremail: req.body.useremail,
      jobstatus: req.body.jobstatus,
      companyname: req.body.companyname,
      jobname: req.body.jobname,
      preparation: req.body.preparation,
      interviewquestion: req.body.interviewquestion,
      interviewexperience: req.body.interviewexperience,
      salary: req.body.salary,
      order: req.body.order,
    })
      .then((result) => {
        res.statueCode = 201;
        res.json({
          success: true,
          result: result,
          message: "success create new job",
        });
      })
      .catch((err) => {
        res.statueCode = 409;
        res.json({
          success: false,
          message: "fail to create new job",
        });
      });
  },
  updateStatus: (req, res) => {
    StatusModel.findOne({
      _id: req.body._id,
    })
      .then((result) => {
        StatusModel.updateOne(
          {
            _id: req.body._id,
          },
          {
            jobstatus: req.body.jobstatus,
            order: req.body.order,
          }
        )
          .then((resultUpdate) => {
            res.statueCode = 201;
            res.json({
              success: true,
              result: resultUpdate,
              message: "success edit new status/change status order",
            });
          })
          .catch((err) => {
            res.statueCode = 409;
            res.json({
              success: false,
              message: "fail to edit new status/change status order",
            });
          });
      })
      .catch((err) => {
        res.statueCode = 409;
        res.json({
          success: false,
          message: "fail to find status id",
        });
      });
  },
  updateJob: (req, res) => {
    JobModel.findOne({
      _id: req.body._id,
    })
      .then((result) => {
        JobModel.updateOne(
          {
            _id: req.body._id,
          },
          {
            jobstatus: req.body.jobstatus,
            companyname: req.body.companyname,
            jobname: req.body.jobname,
            preparation: req.body.preparation,
            interviewquestion: req.body.interviewquestion,
            interviewexperience: req.body.interviewexperience,
            salary: req.body.salary,
            order: req.body.order,
          }
        )
          .then((resultUpdate) => {
            res.statueCode = 201;
            res.json({
              success: true,
              result: resultUpdate,
              message: "success edit new job/change job order",
            });
          })
          .catch((err) => {
            res.statueCode = 409;
            res.json({
              success: false,
              message: "fail to edit new job/change job order",
            });
          });
      })
      .catch((err) => {
        res.statueCode = 409;
        res.json({
          success: false,
          message: "fail to find job id",
        });
      });
  },
  deleteStatus: (req, res) => {
    StatusModel.findOne({
      _id: req.body._id,
    })
      .then((result) => {
        StatusModel.deleteOne({
          _id: req.body._id,
        })
          .then((resultDelete) => {
            res.statueCode = 201;
            res.json({
              success: true,
              result: resultDelete,
              message: "success delete status",
            });
          })
          .catch((err) => {
            res.statueCode = 409;
            res.json({
              success: false,
              message: "fail to delete status",
            });
          });
      })
      .catch((err) => {
        res.statueCode = 409;
        res.json({
          success: false,
          message: "fail to find status id",
        });
      });
  },
  deleteJob: (req, res) => {
    JobModel.findOne({
      _id: req.body._id,
    })
      .then((result) => {
        JobModel.deleteOne({
          _id: req.body._id,
        })
          .then((resultDelete) => {
            res.statueCode = 201;
            res.json({
              success: true,
              result: resultDelete,
              message: "success delete job",
            });
          })
          .catch((err) => {
            res.statueCode = 409;
            res.json({
              success: false,
              message: "fail to delete job",
            });
          });
      })
      .catch((err) => {
        res.statueCode = 409;
        res.json({
          success: false,
          message: "fail to find job id",
        });
      });
  },
};

module.exports = jobControllers;
