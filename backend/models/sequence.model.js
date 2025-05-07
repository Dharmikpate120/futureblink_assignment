const mongoose = require("mongoose");
const { Schema } = mongoose;

const leadsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

var sequence = new Schema({
  email: { type: String, required: true },
  sequenceName: { type: String, required: true },
  sequence: { type: String, required: true },
  leads: [leadsSchema],
  active: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("sequence", sequence);
