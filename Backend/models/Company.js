const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  location: { type: String, required: true },
  carbonCreditsNeeded: { type: Number, required: true },
  companyurl: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  usertype: { type: String, default: "company" },
  password: { type: String, required: true }, // New password field
});

// Hash the password before saving it to the database
companySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash the password if it’s modified

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if entered password matches the hashed password
companySchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Company", companySchema);
