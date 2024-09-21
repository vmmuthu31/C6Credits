const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Company = require("../models/Company");
const Offset = require("../models/Offset");
const bcrypt = require("bcryptjs");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendInviteEmail = (email, token, userType) => {
  const url = `https://c6credits.vercel.app/SetPassword?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Set your password for ${userType}`,
    html: `<p>You have been invited to create an account as a ${userType}. Click <a href="${url}">here</a> to set your password. This link expires in 2 days.</p>`,
  };

  return transporter.sendMail(mailOptions);
};

const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "2d" });
};

exports.inviteUser = async (req, res) => {
  const { email, userType } = req.body;

  try {
    const token = generateToken(email);
    let user;

    if (userType === "company") {
      user = await Company.findOne({ contactEmail: email });
    } else if (userType === "offsetter") {
      user = await Offset.findOne({ email });
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: `${userType} with email ${email} not found` });
    }

    await sendInviteEmail(email, token, userType);
    res.status(200).json({ message: "Invite sent successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Error sending invite", error });
  }
};

exports.setPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user =
      (await Company.findOne({ contactEmail: decoded.email })) ||
      (await Offset.findOne({ email: decoded.email }));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({ message: "Password set successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error setting password", error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user =
      (await Company.findOne({ contactEmail: email })) ||
      (await Offset.findOne({ email }));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, usertype: user.usertype },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
