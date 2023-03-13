const express = require("express");
const router = express.Router();

router.get('/study', (req, res) => {
	res.render('study.ejs');
});

module.exports = router;