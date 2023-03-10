const express = require("express");
const router = express.Router();

router.get('/course', (req, res) => {
	res.render('course.ejs');
});

module.exports = router;