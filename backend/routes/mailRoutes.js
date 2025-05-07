const express = require("express");
const router = express.Router();
require("dotenv").config();
const {
  validateEmail,
  validateSequence,
  validateLeads,
} = require("../utils/validators");
const multer = require("multer");
const agenda = require("../utils/agendaConnector");
const { verifyUserToken } = require("../utils/middlewares");
const sequenceModel = require("../models/sequence.model");

const storage = multer.diskStorage({
  destination: "./public",
});
const upload = multer({
  storage: storage,
});

//signin : returns: {auth_token, role,success} if user already exist!
router.post(
  "/addSequence",
  verifyUserToken,
  upload.none(),
  async (req, res) => {
    if (!req.body) {
      return res.status(404).json({ error: "empty body provided!" });
    }
    var { sequenceName, leads, sequence } = req.body;
    //body={
    // sequenceName:"hello world",
    // leads :[{name:"dharmik",email:"dharmik7458@gmail.com"},{},{}],
    // sequence:
    // [
    //  {type:"task",task:"coldEmail",emailFormat:{header:"hello world",body:"hello world"}},
    //{type:"wait", duration:1 }
    // ],
    //}
    if (!sequenceName || !leads || !sequence) {
      return res.status(400).json({ error: "Missing parts of body!" });
    } else if (!validateSequence(await JSON.parse(sequence))) {
      return res.status(400).json({ error: "Invalid format of sequence!" });
    } else if (!validateLeads(await JSON.parse(leads))) {
      return res.status(400).json({ error: "Invalid Format of Leads!" });
    }

    var result = await sequenceModel.findOne({
      sequenceName,
      email: req.user.email,
    });
    if (result) {
      return res
        .status(400)
        .json({ error: "A sequence with this name already exist!" });
    }
    var sequenceInstance = await sequenceModel.create({
      email: req.user.email,
      sequenceName,
      sequence,
      leads: await JSON.parse(leads),
      active: true,
    });

    sequence = await JSON.parse(sequence);
    leads = await JSON.parse(leads);

    var time = 0;
    sequence.map((seq) => {
      switch (seq.type) {
        case "task":
          agenda.schedule(`in ${time} seconds`, "send email", {
            leads,
            emailFormat: seq.emailFormat,
          });
          break;
        case "wait":
          time += parseInt(seq.duration);
          break;
      }
    });
    res.json({ success: "emails scheduled successfully!" });
    try {
    } catch (err) {
      console.log(err);
      return res.status(401).json({ error: "Internal Server Error!" });
    }
  }
);
router.post(
  "/pauseSequence",
  verifyUserToken,
  upload.none(),
  async (req, res) => {
    try {
      if (!req.body) {
        return res.status(404).json({ error: "empty body provided!" });
      }
      var { sequenceId } = req.body;
      try {
        var result = await sequenceModel.findOne({ _id: sequenceId });
      } catch (err) {
        console.log(err);
        return res.status(401).json({ error: "Invalid Sequence id provided!" });
      }

      if (!result) {
        return res
          .status(400)
          .json({ error: "Sequence with this id Doesn't exist!" });
      } else {
        result.active = false;
        await result.save();
        res.json({ success: "Sequence Paused Successfully!" });
      }
    } catch (err) {
      console.log(err);
      return res.status(401).json({ error: "Internal Server Error!" });
    }
  }
);

router.post(
  "/resumeSequence",
  verifyUserToken,
  upload.none(),
  async (req, res) => {
    try {
      if (!req.body) {
        return res.status(404).json({ error: "empty body provided!" });
      }
      var { sequenceId } = req.body;
      try {
        var result = await sequenceModel.findOne({ _id: sequenceId });
      } catch (err) {
        console.log(err);
        return res.status(401).json({ error: "Invalid Sequence id provided!" });
      }

      if (!result) {
        return res
          .status(400)
          .json({ error: "Sequence with this id Doesn't exist!" });
      } else {
        result.active = true;
        await result.save();
        res.json({ success: "Sequence Paused Successfully!" });
      }
    } catch (err) {
      console.log(err);
      return res.status(401).json({ error: "Internal Server Error!" });
    }
  }
);
router.post(
  "/fetchUserSequences",
  verifyUserToken,
  upload.none(),
  async (req, res) => {
    try {
      var result = await sequenceModel.find(
        { email: req.user.email },
        {   __v: 0, leads: 0 }
      );

      if (!result.length) {
        return res.json({
          success: "You haven't created any sequences yet!",
          sequences: [],
        });
      } else {
        res.json({
          success: "Sequence retrieved successfully!",
          sequences: result,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(401).json({ error: "Internal Server Error!" });
    }
  }
);

module.exports = router;
