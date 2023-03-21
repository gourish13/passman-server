const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/tokens');
const {
  getAllServices,
  matchPassword,
  getService,
  addService,
  updateService,
  deleteService,
} = require("../controllers/api");

router.use(verifyToken);
router.get("/client-key", getClientKey);
router.get("/services", getAllServices);

router.use(matchPassword); // Decrypt password and match
router.post("/service", getService);
router.post('/add-service', addService);
router.post('/update-service', updateService);
router.post('/delete-service', deleteService);

module.exports = router;
