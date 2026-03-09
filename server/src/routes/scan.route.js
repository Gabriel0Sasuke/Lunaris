const express = require('express');
const Router = express.Router();
const scanController = require('../controllers/scan.controller');
const ScanMiddleware = require('../middleware/scan.middleware');



module.exports = Router;