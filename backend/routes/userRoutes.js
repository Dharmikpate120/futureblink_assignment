const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../models/user.model");
const { validateEmail, validateString } = require("../utils/validators");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./public",
});

const upload = multer({
  storage: storage,
});
//signin : returns: {auth_token, role,success} if user already exist!
router.post("/signin", upload.none(), async (req, res) => {
  if (!req.body) {
    return res.status(404).json({ error: "empty body provided!" });
  }
  const body = req.body;
  console.log(body);

  var email = body.email;
  if (!email) {
    return res.status(404).json({ error: "email id is required" });
  }
  var password = body.password;
  if (!password) {
    return res.status(404).json({ error: "password is required" });
  }
  if (!validateEmail(email)) {
    return res.status(422).json({ error: "invalid email" });
  }

  const userCheck = await userModel.findOne({ email });
  if (!userCheck) {
    return res
      .status(404)
      .json({ error: "user not found in the records! please signup:)" });
  }
  try {
    const passwordMatch = bcrypt.compareSync(password, userCheck.password);
    if (passwordMatch) {
      const payload = { email, role: "user" };
      const secretKey = process.env.JWT_SECRET_KEY;
      const token = jwt.sign(payload, secretKey || "dharmikpatel", {
        expiresIn: "10d",
      });
      return res.status(200).json({
        success: "password matched",
        name: userCheck.name,
        auth_token: token,
        role: "user",
      });
    } else {
      return res.status(401).json({ error: "password is incorrect" });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "password doesn't match!" });
  }
});

//signup :returns: {auth_token, role, success} create a new user that doesn't exist already!
router.post("/signup", upload.none(), async (req, res) => {
  try {
    var body = req.body;
    console.log(req.body);
    if (!body) {
      return res.status(404).json({ error: "all fields are required!" });
    }
    var email = body.email;
    var password = body.password;
    var name = body.name;
    if (!email || !password || !name) {
      return res.status(404).json({ error: "all fields are required!" });
    }
    if (!validateEmail(email)) {
      return res.status(422).json({ error: "invalid email" });
    } else if (!validateString(name)) {
      return res.status(422).json({ error: "invalid name" });
    }
    const userCheck = await userModel.findOne({ email });
    if (userCheck?.email) {
      return res.status(409).json({ error: "User Already Exists!" });
    } else {
      password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      const newUser = new userModel({
        email,
        password,
        name,
        role: "user",
      });

      await newUser.save();

      const payload = { email, role: "user" };
      const secretKey = process.env.JWT_SECRET_KEY;
      const token = jwt.sign(payload, secretKey || "dharmikpatel", {
        expiresIn: "10d",
      });

      return res.json({
        success: "account created successfully!",
        auth_token: token,
        name,
        role: "user",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      error: "An unknown error occured, Please try again later!",
    });
  }
});

module.exports = router;
