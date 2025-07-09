const express = require('express');
const auth = require('../middleware/auth');
const { getCourses } = require('../controllers/courseController');
const router = express.Router();
router.get('/', auth, getCourses);
module.exports = router;
