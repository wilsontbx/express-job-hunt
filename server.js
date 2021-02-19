require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const userControllers = require("./controllers/userControllers");
const jobControllers = require("./controllers/jobControllers");
const app = express();
const port = process.env.PORT;

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

mongoose.set("useFindAndModify", false);
app.use(
  express.urlencoded({
    extended: true,
  })
);
const devurl = "http://localhost:3000";
const produrl = "https://jobhunt-app.herokuapp.com";

app.use(
  cors({
    origin: process.env.NODE_ENV === "development" ? devurl : produrl,
  })
);
app.options("*", cors());

//ROUTES
app.get("/", (req, res) => {
  res.send("Welcome to Job Hunt api");
});
app.post("/api/v1/render", verifyJWT, jobControllers.render);
app.post("/api/v1/create/status", verifyJWT, jobControllers.createStatus);
app.post("/api/v1/create/job", verifyJWT, jobControllers.createJob);
app.patch("/api/v1/update/status", verifyJWT, jobControllers.updateStatus);
app.patch("/api/v1/update/job", verifyJWT, jobControllers.updateJob);
app.patch("/api/v1/drag/status", verifyJWT, jobControllers.dragStatus);
app.patch("/api/v1/drag/job", verifyJWT, jobControllers.dragJob);
app.delete("/api/v1/delete/status", verifyJWT, jobControllers.deleteStatus);
app.patch("/api/v1/delete/job", verifyJWT, jobControllers.deleteJob);
app.post("/api/v1/notification", verifyJWT, jobControllers.notification);

//USER ROUTES
app.post("/api/v1/users/register", userControllers.register);
app.post("/api/v1/users/login", userControllers.login);

function verifyJWT(req, res, next) {
  // get the jwt token from the request header
  const authToken = req.headers.auth_token;
  // check if authToken header value is empty, return err if empty
  if (!authToken) {
    res.json({
      success: false,
      message: "Auth header value is missing",
    });
    return;
  }

  // verify that JWT is valid and not expired
  try {
    // if verify success, proceed
    const userData = jwt.verify(authToken, process.env.JWT_SECRET);
    next();
  } catch (err) {
    // if fail, return error msg
    res.json({
      success: false,
      message: "Auth token is invalid",
    });
    return;
  }
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((response) => {
    console.log("DB connection successful");

    app.listen(port, () => {
      console.log(`Job-hunt app listening on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
