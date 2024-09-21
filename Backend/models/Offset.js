const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const offsetSchema = new mongoose.Schema({
  nfcID: { type: String, required: true },
  email: { type: String, required: true },
  carbonOffsetAmount: { type: Number, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  purpose: { type: String, required: true },
  usertype: { type: String, default: "offsetter" },
  password: { type: String, required: true },
});

// Hash the password before saving it to the database
offsetSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if entered password matches the hashed password
offsetSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Offset", offsetSchema);
