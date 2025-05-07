const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const mailRoutes = require("./routes/mailRoutes");
require("dotenv").config();
const mongoose = require("mongoose");
const agenda = require("./utils/agendaConnector");
const sequenceModel = require("./models/sequence.model");
const cors = require("cors");
const MONGODB_URI = process.env.MONGODB_URI;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

setInterval(async () => {
  var result = await sequenceModel.find({ active: true });
  result?.map(async (element) => {
    var sequence = await JSON.parse(element.sequence);
    var time = 0;
    sequence.map((seq) => {
      switch (seq.type) {
        case "task":
          agenda.schedule(`in ${time} seconds`, "send email", {
            leads: element.leads,
            emailFormat: seq.emailFormat,
          });
          break;
        case "wait":
          time += parseInt(seq.duration);
          break;
      }
    });
  });
}, 24 * 60 * 60 * 1000);

app.use(cors());
app.use("/auth", userRoutes);
app.use("/mail", mailRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
