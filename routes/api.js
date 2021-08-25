const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/tokens');
const { 
        matchPassword, 
        getService, 
        addService,
        updateService,
        deleteService
} = require('../controllers/api');

router.use(verifyToken);
router.post('/service', getService);

router.use(matchPassword);
router.post('/add-service', addService);
router.post('/update-service', updateService);
router.post('/delete-service', deleteService);

module.exports = router;
