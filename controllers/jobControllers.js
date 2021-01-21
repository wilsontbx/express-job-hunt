const JobModel = require("../models/job");
const StatusModel = require("../models/Status");
const _ = require("lodash");

const jobControllers = {
    render: (req, res) => {
        StatusModel.find()
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
                JobModel.find()
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

                        res.statusCode = 200;
                        res.json({
                            success: true,
                            message: "Product and Transaction found",
                            status: statusResult,
                            job: jobResult,
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
                    result: resultTransaction,
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
};

module.exports = jobControllers;
