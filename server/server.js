const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

const jwt = require("jsonwebtoken");
const fs = require("fs");
const jwtSecret = "mysuperdupersecret";

const logger = require("./logger");
const _ = require("lodash");
// Middleware

// JSON parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS middleware
app.use(function (req, res, next) {
  // Allow Origins
  res.header("Access-Control-Allow-Origin", "*");
  // Allow Methods
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  // Allow Headers
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, Authorization"
  );
  // Handle preflight, it must return 200
  if (req.method === "OPTIONS") {
    // Stop the middleware chain
    return res.status(200).end();
  }
  // Next middleware
  next();
});

// Auth middleware
app.use((req, res, next) => {
  // login does not require jwt verification
  if (req.path == "/api/login" || req.path == "/api/register") {
    // next middleware
    return next();
  }

  // get token from request header Authorization
  const token = req.headers.authorization;

  // Debug print
  console.log("");
  console.log(req.path);
  console.log("authorization:", token);

  // Token verification
  try {
    var decoded = jwt.verify(token, jwtSecret);
    console.log("decoded", decoded);
  } catch (err) {
    // Catch the JWT Expired or Invalid errors
    return res.status(401).json({ msg: err.message });
  }

  // next middleware
  next();
});

// Routes
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  logger.info({
    username: username,
    password: password,
    function: "register",
  });
  res.json({ msg: "register success" });
});

app.post("/api/login", (req, res) => {
  //Not check USER, PASS ==> always return 200
  console.log("Log in by: ", req.body);
  const { username, password } = req.body;
  const currentTime = new Date();
  const token = jwt.sign(
    { username: username, password: password },
    jwtSecret,
    { expiresIn: 300 }
  ); // 5 min token
  logger.info({
    username: username,
    password: password,
    function: "login",
  });
  res.json({ token: token, username: username, currentTime: currentTime });
});

app.get("/api/token/ping", (req, res) => {
  // Middleware will already catch if token is invalid
  // so if he can get this far, that means token is valid
  res.json({ msg: "all good mate" });
});

app.get("/api/ping", (req, res) => {
  // random endpoint so that the client can call something
  res.json({ msg: "pong" });
});

app.get("/api/logindata", (req, res) => {
  try {
    fs.readFile("./log/centralize.log", "utf-8", (err, data) => {
      if (err) throw err;
      let log_list = data.split('\n')
      log_list = log_list.filter(item=> !!item).map(item => JSON.parse(item))
      console.log(log_list)
      res.json({ msg: "success", data: log_list });
    });
  } catch (err) {
    return res.status(401).json({ msg: err.message });
  }
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
