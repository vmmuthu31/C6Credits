const Offset = require("../models/Offset");
const bcrypt = require("bcryptjs");

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
    const {
      nfcID,
      email,
      carbonOffsetAmount,
      date,
      location,
      purpose,
      password,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newOffset = new Offset({
      nfcID,
      email,
      carbonOffsetAmount,
      date,
      location,
      purpose,
      password: hashedPassword,
    });

    await newOffset.save();
    res.status(201).json({ message: "Offset entry created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving offset data", error });
  }
};
