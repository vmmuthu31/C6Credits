const express = require("express");
const {
  inviteUser,
  setPassword,
  login,
} = require("../controllers/authController");
const {
  getCompanies,
  getCompanyById,
  createCompany,
} = require("../controllers/companyController");
const {
  getOffsets,
  getOffsetById,
  createOffset,
} = require("../controllers/offsetController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/invite", inviteUser);
router.post("/set-password", setPassword);
router.post("/login", login);

router.get("/companies", protect, getCompanies);
router.get("/companies/:id", protect, getCompanyById);
router.post("/companies", createCompany);

router.get("/offsets", protect, getOffsets);
router.get("/offsets/:id", protect, getOffsetById);
router.post("/offsets", createOffset);

module.exports = router;
