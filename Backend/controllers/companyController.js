const Company = require("../models/Company");
const bcrypt = require("bcryptjs");
const { generateToken, sendInviteEmail } = require("./authController");

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.status(200).json({ data: companies });
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies", error });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json({ data: company });
  } catch (error) {
    res.status(500).json({ message: "Error fetching company", error });
  }
};
exports.createCompany = async (req, res) => {
  try {
    const {
      companyName,
      industry,
      location,
      carbonCreditsNeeded,
      companyurl,
      contactEmail,
      contactPhone,
    } = req.body;

    const existingCompany = await Company.findOne({ contactEmail });
    if (existingCompany) {
      return res
        .status(400)
        .json({ message: "Company with this contact email already exists" });
    }

    const newCompany = new Company({
      companyName,
      industry,
      location,
      carbonCreditsNeeded,
      companyurl,
      contactEmail,
      contactPhone,
    });

    await newCompany.save();

    const token = generateToken(contactEmail);
    await sendInviteEmail(contactEmail, token, "company");

    res.status(201).json({
      message: "Company created successfully, invite sent",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving company data", error });
  }
};
