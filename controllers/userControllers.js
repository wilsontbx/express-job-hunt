const jwt = require("jsonwebtoken");
const UserModel = require("../models/users");
const SHA256 = require("crypto-js/sha256");
const uuid = require("uuid");
const NotificationModel = require("../models/notification");

const userControllers = {
  register: (req, res) => {
    UserModel.findOne({
      email: req.body.email,
    })
      .then((result) => {
        // if found in DB, means email has already been take, redirect to registration page
        if (result) {
          res.statusCode = 409;
          res.json({
            success: false,
            message: "The register email is exist",
          });
          return;
        }
        const salt = uuid.v4();
        const combination = salt + req.body.password;
        const hash = SHA256(combination).toString();
        UserModel.create({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          pwsalt: salt,
          hash: hash,
        })
          .then((createResult) => {
            NotificationModel.create({ email: req.body.email })
              .then((notificationResult) => {
                const token = jwt.sign(
                  {
                    first_name: createResult.first_name,
                    last_name: createResult.last_name,
                    email: createResult.email,
                  },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "1h",
                  }
                );
                const rawJWT = jwt.decode(token);
                res.statusCode = 201;
                res.json({
                  success: true,
                  token: token,
                  expiresAt: rawJWT.exp,
                  info: rawJWT,
                  activity: true,
                });
              })
              .catch((err) => {
                res.statusCode = 409;
                res.json({
                  success: false,
                  message: "unable to create activity due to unexpected error",
                });
              });
          })
          .catch((err) => {
            res.statusCode = 409;
            res.json({
              success: false,
              message: "unable to register due to unexpected error",
            });
          });
      })
      .catch((err) => {
        res.statusCode = 409;
        res.json({
          success: false,
          message: "The register email is exist",
        });
      });
  },

  login: (req, res) => {
    UserModel.findOne({
      email: req.body.email,
    })
      .then((result) => {
        // check if result is empty, if it is, no user, so login fail, redirect to login page
        if (!result) {
          res.statusCode = 401;
          res.json({
            success: false,
            message: "Either email or password is wrong",
          });
          return;
        }

        // combine DB user salt with given password, and apply hash algo
        const hash = SHA256(result.pwsalt + req.body.password).toString();

        // check if password is correct by comparing hashes
        if (hash !== result.hash) {
          res.statusCode = 401;
          res.json({
            success: false,
            message: "Either email or password is wrong",
          });
          return;
        }
        // login successful, generate JWT
        const token = jwt.sign(
          {
            first_name: result.first_name,
            last_name: result.last_name,
            email: result.email,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        // decode JWT to get raw values
        const rawJWT = jwt.decode(token);
        // return token as json response
        res.json({
          success: true,
          token: token,
          expiresAt: rawJWT.exp,
          info: rawJWT,
        });
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json({
          success: false,
          message: "unable to login due to unexpected error",
        });
      });
  },
  getUserInfo: (req, res) => {
    const token = req.headers.auth_token;
    const rawJWT = jwt.decode(token);
    UserModel.findOne({
      email: rawJWT.email,
    })
      .then((result) => {
        if (!result) {
          res.statusCode = 401;
          res.json({
            success: false,
            message: "token is invalid",
          });
          return;
        }
        res.json({
          success: true,
          first_name: result.first_name,
          last_name: result.last_name,
          email: result.email,
        });
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json({
          success: false,
          message: "unable to get user info",
        });
      });
  },
  updateUserInfo: (req, res) => {
    console.log(req.body);
    const token = req.headers.auth_token;
    const rawJWT = jwt.decode(token);
    UserModel.findOneAndUpdate(
      {
        email: rawJWT.email,
      },
      {
        email: req.body.email,
      }
    ).then((response) => {
      console.log(response);
    });
  },
};

module.exports = userControllers;
