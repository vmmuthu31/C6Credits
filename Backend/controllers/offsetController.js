const Offset = require("../models/Offset");
const bcrypt = require("bcryptjs");
const { generateToken, sendInviteEmail } = require("./authController");

exports.getOffsets = async (req, res) => {
  try {
    const offsets = await Offset.find({});
    res.status(200).json({ data: offsets });
  } catch (error) {
    res.status(500).json({ message: "Error fetching offsets", error });
  }
};

exports.getOffsetById = async (req, res) => {
  try {
    const offset = await Offset.findById(req.params.id);
    if (!offset) {
      return res.status(404).json({ message: "Offset not found" });
    }
    res.status(200).json({ data: offset });
  } catch (error) {
    res.status(500).json({ message: "Error fetching offset", error });
  }
};
exports.createOffset = async (req, res) => {
  try {
    const { nfcID, email, carbonOffsetAmount, date, location, purpose } =
      req.body;

    const existingOffset = await Offset.findOne({ email });
    if (existingOffset) {
      return res
        .status(400)
        .json({ message: "Offsetter with this email already exists" });
    }

    const newOffset = new Offset({
      nfcID,
      email,
      carbonOffsetAmount,
      date,
      location,
      purpose,
    });

    await newOffset.save();

    const token = generateToken(email);
    await sendInviteEmail(email, token, "offsetter");

    res.status(201).json({
      message: "Offset entry created successfully, invite sent",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving offset data", error });
  }
};
