const JobModel = require("../models/job");
const shortid = require("shortid");
const NotificationModel = require("../models/notification");

const jobControllers = {
  render: (req, res) => {
    const { email } = req.body;
    JobModel.find({
      email: email,
    })
      .sort({ order: 1 })
      .then((allResult) => {
        if (!allResult) {
          res.statusCode = 401;
          res.json({
            success: false,
            message: "The is job status column is empty",
          });
          return;
        }

        res.statusCode = 200;
        res.json({
          success: true,
          message: "Job and Status found",
          allResult: allResult,
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
    const { email, jobstatus, order } = req.body;
    JobModel.create({
      email: email,
      jobstatus: jobstatus,
      order: order,
    })
      .then((result) => {
        res.statusCode = 201;
        res.json({
          success: true,
          result: result,
          message: "success create new status",
        });
      })
      .catch((err) => {
        res.statusCode = 409;
        res.json({
          success: false,
          message: "fail to create new status",
        });
      });
  },
  createJob: (req, res) => {
    const listId = shortid.generate();
    const {
      email,
      jobstatus,
      companyname,
      jobname,
      preparation,
      interviewquestion,
      interviewexperience,
      salary,
    } = req.body;
    JobModel.updateOne(
      { email: email, jobstatus: jobstatus },
      {
        $push: {
          joblist: {
            _id: listId,
            companyname: companyname,
            jobname: jobname,
            preparation: preparation,
            interviewquestion: interviewquestion,
            interviewexperience: interviewexperience,
            salary: salary,
          },
        },
      }
    )
      .then((result) => {
        res.statusCode = 201;
        res.json({
          success: true,
          result: result,
          message: "success create new job",
        });
      })
      .catch((err) => {
        res.statusCode = 409;
        res.json({
          success: false,
          message: "fail to create new job",
        });
      });
  },
  updateStatus: (req, res) => {
    const { email, statusid, jobstatus, order } = req.body;
    JobModel.updateOne(
      {
        email: email,
        _id: statusid,
      },
      {
        jobstatus: jobstatus,
        order: order,
      }
    )
      .then((resultUpdate) => {
        res.statusCode = 201;
        res.json({
          success: true,
          result: resultUpdate,
          message: "success edit new status/change status order",
        });
      })
      .catch((err) => {
        res.statusCode = 409;
        res.json({
          success: false,
          message: "fail to edit new status/change status order",
        });
      });
  },
  updateJob: (req, res) => {
    const {
      email,
      _id,
      index,
      companyname,
      jobname,
      preparation,
      interviewquestion,
      interviewexperience,
      salary,
    } = req.body;
    const listId = shortid.generate();
    const jobidx = `joblist.${index}`;
    console.log(email);
    JobModel.updateOne(
      {
        email: email,
        _id: _id,
      },
      {
        $set: {
          [jobidx]: {
            _id: listId,
            companyname: companyname,
            jobname: jobname,
            preparation: preparation,
            interviewquestion: interviewquestion,
            interviewexperience: interviewexperience,
            salary: salary,
          },
        },
      }
    )
      .then((resultUpdate) => {
        res.statusCode = 201;
        res.json({
          success: true,
          result: resultUpdate,
          message: "success edit job order",
        });
      })
      .catch((err) => {
        res.statusCode = 409;
        res.json({
          success: false,
          message: "fail to edit job order",
        });
      });
  },
  dragStatus: (req, res) => {
    const { email, statusid, oldorder, neworder } = req.body;
    let start,
      end,
      condition = 0;
    if (neworder > oldorder) {
      start = oldorder;
      end = neworder;
      condition = -1;
    } else {
      start = neworder;
      end = oldorder;
      condition = 1;
    }

    JobModel.updateMany(
      { email: email, order: { $gte: start, $lte: end } },
      { $inc: { order: condition } }
    )
      .then((result) => {
        JobModel.updateOne({ email: email, _id: statusid }, { order: neworder })
          .then((updateResult) => {
            res.statusCode = 201;
            res.json({
              success: true,
              result: updateResult,
              message: "success to update destination status ",
            });
          })
          .catch((err) => {
            res.statusCode = 409;
            res.json({
              success: false,
              message: "fail to update destination status ",
            });
          });
      })
      .catch((err) => {
        res.statusCode = 409;
        res.json({
          success: false,
          message: "fail to update many status ",
        });
      });
  },
  dragJob: (req, res) => {
    const { email, jobid, oldstatus, oldorder, newstatus, neworder } = req.body;
    JobModel.findOneAndUpdate(
      { email: email, jobstatus: oldstatus },
      { $pull: { joblist: { _id: jobid } } },
      { projection: { joblist: true } }
    )
      .then((result) => {
        const pullResult = result.joblist[oldorder];
        JobModel.updateOne(
          { jobstatus: newstatus },
          {
            $push: {
              joblist: { $each: [pullResult], $position: neworder },
            },
          }
        )
          .then((resultUpdate) => {
            res.statusCode = 201;
            res.json({
              success: true,
              result: resultUpdate,
              message: "success drag job order",
            });
          })
          .catch((err) => {
            res.statusCode = 409;
            res.json({
              success: false,
              message: "fail to drag job order",
            });
          });
      })
      .catch((err) => {
        res.statusCode = 409;
        res.json({
          success: false,
          message: "fail to drag out",
        });
      });
  },
  deleteStatus: (req, res) => {
    const { email, _id } = req.body;
    JobModel.deleteOne({
      email: email,
      _id: _id,
    })
      .then((resultDelete) => {
        res.statusCode = 201;
        res.json({
          success: true,
          result: resultDelete,
          message: "success delete status",
        });
      })
      .catch((err) => {
        res.statusCode = 409;
        res.json({
          success: false,
          message: "fail to delete status",
        });
      });
  },
  deleteJob: (req, res) => {
    const { email, statusid, jobid } = req.body;
    JobModel.updateOne(
      {
        email: email,
        _id: statusid,
      },
      {
        $pull: { joblist: { _id: jobid } },
      }
    )
      .then((resultDelete) => {
        res.statusCode = 201;
        res.json({
          success: true,
          result: resultDelete,
          message: "success delete job",
        });
      })
      .catch((err) => {
        res.statusCode = 409;
        res.json({
          success: false,
          message: "fail to delete job",
        });
      });
  },
};

module.exports = jobControllers;
