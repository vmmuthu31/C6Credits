const mongoose = require("mongoose");

const offsetSchema = new mongoose.Schema({
  nfcID: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  carbonOffsetAmount: { type: Number, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  purpose: { type: String, required: true },
  usertype: { type: String, default: "offsetter" },
  password: { type: String },
});

module.exports = mongoose.model("Offset", offsetSchema);
