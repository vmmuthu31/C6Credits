const Company = require("../models/Company");
const bcrypt = require("bcryptjs");

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
      password,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCompany = new Company({
      companyName,
      industry,
      location,
      carbonCreditsNeeded,
      companyurl,
      contactEmail,
      contactPhone,
      password: hashedPassword,
    });

    await newCompany.save();
    res.status(201).json({ message: "Company created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving company data", error });
  }
};
