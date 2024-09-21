const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  location: { type: String, required: true },
  carbonCreditsNeeded: { type: Number, required: true },
  companyurl: { type: String, required: true },
  contactEmail: { type: String, required: true, unique: true },
  contactPhone: { type: String, required: true },
  usertype: { type: String, default: "company" },
  password: { type: String },
});

module.exports = mongoose.model("Company", companySchema);
