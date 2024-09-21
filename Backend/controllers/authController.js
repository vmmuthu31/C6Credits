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
    subject: `Invitation to Join C6Credits as a ${userType}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #4CAF50;">Welcome to C6Credits!</h2>
        <p>Dear ${email},</p>
        <p>
          You have been invited to create an account as a <strong>${userType}</strong> on 
          <strong>C6Credits</strong>, a trusted platform for carbon offset management.
        </p>
        <p>To complete your registration and set your password, please click the link below:</p>
        <p style="text-align: center;">
          <a 
            href="${url}" 
            style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Set Your Password
          </a>
        </p>
        <p>This link is valid for 2 days. If you did not request this invitation, please ignore this email.</p>
        <p>Thank you for choosing C6Credits!</p>
        <hr style="border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 0.9em; color: #888;">If you have any questions, feel free to reply to this email or contact us at support@c6credits.com.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "2d" });
};

module.exports = {
  generateToken,
  sendInviteEmail,
  inviteUser: async (req, res) => {
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
  },
  setPassword: async (req, res) => {
    const { token, password } = req.body;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user = await Company.findOne({
        contactEmail: decoded.email.toLowerCase(),
      });
      if (!user) {
        user = await Offset.findOne({ email: decoded.email.toLowerCase() });
      }
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.password = await bcrypt.hash(password, 10);
      await user.save();

      res.status(200).json({ message: "Password set successfully" });
    } catch (error) {
      console.error("Error setting password:", error);
      res.status(500).json({ message: "Error setting password", error });
    }
  },
  login: async (req, res) => {
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
  },
};
